from datetime import datetime, timezone, timedelta, date

class Reservation:
      def __init__(self, db, alert, dashboard, getAllArea):
            self.db = db
            self.alert = alert
            self.dashboard = dashboard
            self.all_area = getAllArea
      
      def get_avl_spaces(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute('''
                              SELECT area_name, category, count(area_name) AS available 
                              FROM accomodation_spaces 
                              WHERE status = 'avl' GROUP BY area_name 
                              ORDER BY FIELD(category, 'Room', 'Cottage', 'Hall') ASC;
                        ''')

                  data = cursor.fetchall()
                  result = [ {"area": d.get('area_name'), "count": d.get('available'), "category": d.get('category')} for d in data ]
                  
                  return result

            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def get_avl_room(self, name):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        if name != 'All Hall':
                              cursor.execute(''' SELECT room, area_name, capacity from accomodation_spaces where status = %s AND area_name = %s''', ("avl", name.capitalize()))
                        else:
                              cursor.execute(''' SELECT room, area_name, capacity from accomodation_spaces where status = %s AND area_name in ('Pavillion Hall', 'Mariposa Hall', 'Minicon Hall') ''', ("avl"))
                        data = cursor.fetchall()

                        rooms = [ {"room": row.get("room"), "name": row.get("area_name"), "capacity": row.get("capacity")} for row in data ]
                        return {"rooms": rooms}

            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def add_booking(self, name, total_guest, booking_status, booking_type, payment, accomodations_selected, checkin, checkout=None, book_date=None, date_paid_add=None):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        
                        areaNames = self.all_area().get('data')
                        
                        parts = accomodations_selected.split(',')
                        rooms = [ " ".join(p.strip().rsplit(" ", 1)[:-1]) for p in parts ]
                        room_no = [ p.split(' ')[-1] for p in parts ]

                        result_list = []

                        new_checkin = datetime.strptime(checkin, "%Y-%m-%d").date()
                        new_checkout = datetime.strptime(checkout, "%Y-%m-%d").date() if checkout else new_checkin
                        today = date.today()
                        new_status = 'Checked-out' if new_checkout < today else booking_status

                        guest_revenue = int(total_guest) * 200
                        new_amount = guest_revenue
                        
                        cursor.execute(''' SELECT * FROM promos WHERE status IN ('Active') and end_date > CURRENT_DATE() ''')
                        promo_data = cursor.fetchone()
                        
                        room_affected = []

                        count = 0
                        new_area_revenue = []

                        for room in rooms:
                              cursor.execute(''' SELECT rate, orig_rate FROM accomodation_spaces WHERE area_name = %s LIMIT 1 ''', (room.strip(),))
                              rate_data = cursor.fetchone()

                              promo_rate = float(rate_data.get('rate'))
                              orig_rate = float(rate_data.get('orig_rate'))
                              revenue_per_area = 0

                              if promo_data:
                                    promo_name = promo_data.get('name')
                                    promo_area = promo_data.get('area').split(',')
                                    promo_start = promo_data.get('start_date') 
                                    promo_end = promo_data.get('end_date')
                                    
                                    if room.strip() in promo_area:
                                          if new_checkout > promo_start and new_checkin < promo_start:
                                                room_affected.append(parts[count])
                                                gap = new_checkout - promo_start
                                          elif  new_checkout > promo_end and new_checkin < promo_end:
                                                room_affected.append(parts[count])
                                                gap = promo_end - new_checkin
                                          elif new_checkin >= promo_start and new_checkout <= promo_end:
                                                room_affected.append(parts[count])
                                                gap = 0
                                          else: 
                                                gap = None
                              else:
                                    promo_start = None
                                    promo_end = None

                              if new_checkin < new_checkout:
                                    day = new_checkin
                                    while day < new_checkout:
                                          if promo_start and day >= promo_start: # if promo start today and checkin is before promo start
                                                if promo_end and day >= promo_end: # if promo end and the check in is after it
                                                      nightly_rate = orig_rate # add the original rate 
                                                else:
                                                      nightly_rate = promo_rate # get the promo rate
                                          else:
                                                nightly_rate = orig_rate

                                          revenue_per_area += nightly_rate
                                          new_amount += nightly_rate
                                          day += timedelta(days=1)
                              else:
                                    if booking_type == 'Day Guest':
                                          new_amount += promo_rate if promo_end and promo_end >= today else orig_rate
                                          revenue_per_area += promo_rate if promo_end and promo_end >= today else orig_rate
                                    else: # for same day checkin and checkout
                                          new_amount += promo_rate / 2 if promo_end and promo_end >= today else orig_rate / 2
                                          revenue_per_area += promo_rate / 2 if promo_end and promo_end >= today else orig_rate / 2

                             # new_area_revenue[room.lower()] = revenue_per_area - (revenue_per_area * 0.05) if payment == 'ZUZU (Online Payment)' else revenue_per_area
                              new_area_revenue.append({ "area": room, 'revenue':  revenue_per_area - (revenue_per_area * 0.05) if payment == 'ZUZU (Online Payment)' else revenue_per_area })
                              count += 1

                        if payment == 'ZUZU (Online Payment)':
                              new_amount = new_amount - (new_amount * 0.05)

                        if room_affected:
                              if gap != None:
                                    if gap != 0:
                                          full_promo_name = f'{promo_name} discount ({gap.days} {'days' if gap.days > 1 else 'day'} only)' if len(room_affected) > 0 else 'No promo.'
                                    else:
                                          full_promo_name = f'{promo_name} discount' if len(room_affected) > 0 else 'No promo.'
                              else:
                                    full_promo_name = 'No promo.'
                        else:
                              full_promo_name = 'No promo.'
                        
                        if new_checkout < today:
                              cursor.execute(''' INSERT INTO bookings (name, date_book, check_in, check_out, accomodations, total_guest, booking_type, payment, status, total_amount, paid_date, promo, promo_area) 
                              VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                              ''', (name, book_date if book_date != None else checkin, checkin, checkout if checkout else checkin, ", ".join(parts), total_guest, booking_type, payment, new_status, new_amount, date_paid_add if payment != 'Pending' else None, full_promo_name, ", ".join(room_affected) if len(room_affected) > 0 else 'No accomodations under promo.'))
                        else:
                              cursor.execute(''' INSERT INTO bookings (name, date_book, check_in, check_out, accomodations, total_guest, booking_type, payment, status, total_amount, paid_date, promo, promo_area) 
                              VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                              ''', (name, book_date if book_date != None else checkin, checkin, checkout if checkout else checkin, ", ".join(parts), total_guest, booking_type, payment, new_status, new_amount, date_paid_add if payment != 'Pending' else None, full_promo_name, ", ".join(room_affected) if len(room_affected) > 0 else 'No accomodations under promo.'))
                              
                        if cursor.rowcount != 0: result_list.append(True)

                        now = datetime.now(timezone.utc)
                        for room, number in set(zip(rooms, room_no)):
                              if new_status == 'Checked-in':
                                    cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("occupied", room.strip(), number))
                              elif new_status == 'Reserved':
                                    cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("reserved", room.strip(), number))
                              else:
                                    #cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE name=%s AND room=%s''', ("need-clean", room.capitalize().strip(), number))
                                    #cursor.execute(''' INSERT INTO notifications(name, date, room_name, room_no, alert_type) VALUES(%s, %s, %s, %s, %s) ''', (f'Housekeeping requested for {areaNames.get(room.capitalize())}  {number}', now, room, number, 'housekeeping'))
                                    
                                    if new_checkout == today - timedelta(days=1):
                                          cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("need-clean", room.capitalize().strip(), number))
                                          cursor.execute(''' INSERT INTO notifications(name, date, room_name, room_no, alert_type) VALUES(%s, %s, %s, %s, %s) ''', (f'Housekeeping requested for {areaNames.get(room.capitalize())}  {number}', now, room, number, 'housekeeping'))
                                    else:
                                          cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("avl", room.capitalize().strip(), number))

                        con.commit()

                        cursor.execute(''' SELECT booking_id FROM bookings ORDER BY booking_id DESC LIMIT 1; ''')
                        data_id = cursor.fetchone()
                        booking_id = data_id.get('booking_id')

                        for a in new_area_revenue:
                              cursor.execute('''
                                    INSERT INTO area_revenue(booking_id, area, check_in, check_out, amount)  VALUES(%s, %s, %s, %s, %s)
                              ''', (booking_id, a['area'], checkin,  checkout if checkout else checkin, a['revenue']))
                              con.commit()

                        self.alert.generate_alerts()

                        success = True
                        for result in range(len(result_list)):
                              if result_list[result] == False: success = False
                        
                        return {'success': success, 'message': 'Booking added successfully!' if success else "Failed to add!"}
                  
            except Exception as e:
                  con.rollback()
                  return {'success': False, 'message': f'Error: {str(e)}'}

      def update_reservation_date(self, id, edit_checkin, edit_checkout, booking_type, accomodations, total_guest, payment, request_type=None, ):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT area, amount FROM area_revenue WHERE booking_id = %s ''', (id,))
                        area_revenue = cursor.fetchone()

                        areas = accomodations.split(',') # accomodations per booking

                        new_checkin = datetime.strptime(edit_checkin, "%Y-%m-%d").date()
                        new_checkout = datetime.strptime(edit_checkout, "%Y-%m-%d").date()

                        guest_revenue = int(total_guest) * 200
                        today = date.today()
                        new_area_revenue2 = area_revenue.copy()
                        
                        new_area_revenue2 = {key: 0 for key in new_area_revenue2}  # Reset values
                        new_amount = guest_revenue

                        new_area_revenue = []  # calcutate new revenue per booking 
                        room_affected = [] # store the affected room or the area where under promo, used to display in each booking like what area is under promo

                        # loop each area and update bookings
                        for area in areas:
                              area_name = " ".join(area.rsplit(' ')[:-1]).strip() # get the area name without the room no

                              # Fetch both rates
                              cursor.execute(''' SELECT rate, orig_rate FROM accomodation_spaces WHERE area_name = %s LIMIT 1 ''', (area_name,))
                              rate_data = cursor.fetchone()
                              promo_rate = float(rate_data.get('rate'))
                              orig_rate = float(rate_data.get('orig_rate'))

                              revenue_per_area = 0

                              cursor.execute(''' SELECT * FROM promos WHERE status in ('Active') and end_date > CURRENT_DATE()''')
                              promo_data = cursor.fetchone()

                              if promo_data: # check if there is active promo
                                    promo_name = promo_data.get('name')
                                    promo_area = promo_data.get('area').split(',')
                                    promo_start = promo_data.get('start_date') 
                                    promo_end = promo_data.get('end_date')

                                    if area_name in promo_area: # check if the each area in the accomodations is under the promo
                                          # get the gap and append the area under promo
                                          if new_checkout > promo_start and new_checkin < promo_start: 
                                                room_affected.append(area)
                                                gap = new_checkout - promo_start 
                                          elif  new_checkout > promo_end and new_checkin < promo_end:
                                                room_affected.append(area)
                                                gap = promo_end - new_checkin
                                          elif new_checkin >= promo_start and new_checkout <= promo_end:
                                                room_affected.append(area)
                                                gap = 0
                                          else: 
                                                gap = None
                              else:
                                    promo_start = None
                                    promo_end = None

                              if new_checkin < new_checkout: #room stay
                                    # Handle revenue if promo applied
                                    day = new_checkin
                                    while day < new_checkout: # loop until the day every night the guest stay
                                          if promo_start and day >= promo_start: # if promo start today and checkin is before promo start
                                                if promo_end and day >= promo_end: # if promo end and the check in is after it
                                                      nightly_rate = orig_rate # add the original rate 
                                                else:
                                                      nightly_rate = promo_rate # get the promo rate
                                          else:
                                                nightly_rate = orig_rate
                                                
                                          revenue_per_area += nightly_rate
                                          new_amount += nightly_rate

                                          day += timedelta(days=1)
                              else: # day guest
                                    if booking_type == 'Day Guest':
                                          new_amount += promo_rate if promo_end and promo_end >= today else orig_rate
                                          revenue_per_area += promo_rate if promo_end and promo_end >= today else orig_rate
                                    else: # for same day checkin and checkout
                                          new_amount += promo_rate / 2 if promo_end and promo_end >= today else orig_rate / 2
                                          revenue_per_area += promo_rate / 2 if promo_end and promo_end >= today else orig_rate / 2
                              
                              # get the calculated revenue
                              new_area_revenue.append({ 'area': area , 'revenue': revenue_per_area - (revenue_per_area * 0.05) if payment.strip() == 'ZUZU (Online Payment)' else revenue_per_area })
                        
                        # apply zuzu discount to the updated revenue if payment is zuzu
                        if payment.strip() == 'ZUZU (Online Payment)':
                              new_amount = new_amount - (new_amount * 0.05)

                        # update the area revenue table with the new revenue for forecasting
                        for a in new_area_revenue:
                              cursor.execute('''
                                    UPDATE area_revenue SET check_in = %s, check_out = %s, amount = %s WHERE booking_id = %s AND area = %s
                              ''', ( new_checkin, new_checkout, a['revenue'], id, a['area'] ))

                        # dynamically update the booking promo name and promo area
                        if request_type != 'remove': # if you update the date of the bookings or add a promo, update the booking 
                              if room_affected:
                                    if gap != None:
                                          if gap != 0:
                                                full_promo_name = f'{promo_name} discount ({gap.days} {'days' if gap.days > 1 else 'day'} only)' if len(room_affected) > 0 else 'No promo.'
                                          else:
                                                full_promo_name = f'{promo_name} discount' if len(room_affected) > 0 else 'No promo.'
                                    else:
                                          full_promo_name = 'No promo.'
                              else:
                                    full_promo_name = 'No promo.'

                              cursor.execute(''' UPDATE bookings SET check_in = %s, check_out = %s, total_amount = %s, promo = %s, promo_area = %s WHERE booking_id = %s ''', 
                              (edit_checkin, edit_checkout, new_amount, full_promo_name, ", ".join(room_affected) if len(room_affected) > 0 else 'No accomodations under promo.', id))
                        else: # if you remove a promo, reset the promo name and area in each booking as none
                              cursor.execute(''' UPDATE bookings SET check_in = %s, check_out = %s, total_amount = %s WHERE booking_id = %s ''', 
                              (edit_checkin, edit_checkout, new_amount, id))

                        con.commit()

                        # generate alerts, commonly if there is coming reservation tommorow or today or even checkout today
                        self.alert.generate_alerts()

                        return {'success': bool(cursor.rowcount > 0), 'message': "Updated successfully!" if cursor.rowcount > 0 else 'Failed to update.'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def bookings_data(self, category, page, year, month, day=None):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        params = []
                        conditions = []
                        
                        # ================= DATE FILTER =================
                        if month and day:
                              start_date = date(int(year), int(month), int(day))
                              conditions.append("check_in = %s")
                              params.append(start_date)

                        elif month:
                              start_date = date(int(year), int(month), 1)

                              if int(month) == 12:
                                    end_date = date(int(year) + 1, 1, 1)
                              else:
                                    end_date = date(int(year), int(month) + 1, 1)

                              conditions.append(" check_in >= %s AND check_in < %s ")
                              params.extend([start_date, end_date])

                        # ================= CATEGORY FILTER =================
                        if category == "overnight":
                              conditions.append('booking_type = "Check-in" AND status IN ("Checked-in","Checked-out","Reserved")')

                        elif category == "check_in":
                              conditions.append('status = "Checked-in"')

                        elif category == "reserved":
                              conditions.append('status = "Reserved"')

                        elif category == "day_guest":
                              conditions.append('booking_type = "Day Guest" AND status IN ("Checked-in","Checked-out","Reserved")')


                        # ================= BUILD WHERE =================
                        where_clause = ""

                        if conditions:
                              where_clause = "WHERE " + " AND ".join(conditions)

                        # ================= COUNT =================
                        count_sql = f'''
                        SELECT COUNT(*) AS total
                        FROM bookings
                        {where_clause}
                        '''

                        cursor.execute(count_sql, params)
                        total = cursor.fetchone()["total"]

                        # ================= DATA QUERY =================
                        offset = (int(page) - 1) * 10

                        sql = f'''
                              SELECT
                                    booking_id,
                                    name,
                                    date_book,
                                    check_in,
                                    check_out,
                                    accomodations,
                                    booking_type,
                                    paid_date,
                                    total_amount,
                                    status,
                                    total_guest, 
                                    promo,
                                    promo_area,
                                    payment,
                                    DATEDIFF(check_out, check_in) AS stay_gap
                              FROM bookings
                              {where_clause}
                              ORDER BY check_in DESC
                              LIMIT 10 OFFSET %s
                        '''

                        cursor.execute(sql, params + [offset])
                        data = cursor.fetchall()

                        new_data = [
                              {
                                    "booking_id": d["booking_id"],
                                    "name": d["name"],
                                    "total_guest": d["total_guest"],
                                    "amount": float(d["total_amount"]),
                                    "date_book": d["date_book"],
                                    "check_in": d["check_in"],
                                    "check_out": d["check_out"],
                                    "accomodations": d["accomodations"],
                                    "booking_type": d["booking_type"],
                                    "status": d["status"],
                                    "stay": d["stay_gap"],
                                    "payment": d["payment"],
                                    "date_paid": d["paid_date"],
                                    "promo": d["promo"],
                                    "area_under_promo": d["promo_area"]
                              }
                              for d in data
                        ]

                        # ================= GET COUNT BY CATEGORY =================
                        all_params = params * 5
                        
                        cursor.execute(f"""
                              WITH c_checkin AS (
                                    SELECT COUNT(*) AS total_checkin
                                    FROM bookings
                                    WHERE {str(conditions[0])}
                                    AND status = 'Checked-in'
                              ),
                              c_reserved AS (
                                    SELECT COUNT(*) AS total_reserved
                                    FROM bookings
                                    WHERE {str(conditions[0])}
                                    AND status = 'Reserved'
                              ),
                              c_overnight AS (
                                    SELECT COUNT(*) AS total_overnight
                                    FROM bookings
                                    WHERE {str(conditions[0])}
                                    AND booking_type = 'Check-in' and status in ("Checked-in", "Checked-out", "Reserved")
                              ),
                              c_dayguest AS (
                                    SELECT COUNT(*) AS total_dayguest
                                    FROM bookings
                                    WHERE {str(conditions[0])}
                                    AND booking_type = 'Day Guest' and status in ("Checked-in", "Checked-out", "Reserved")
                              ),
                              c_all AS (
                                    SELECT COUNT(*) AS total_all
                                    FROM bookings
                                    WHERE {str(conditions[0])}
                              )
                              SELECT 
                                    ci.total_checkin,
                                    r.total_reserved,
                                    o.total_overnight,
                                    dg.total_dayguest,
                                    a.total_all
                              FROM c_checkin ci,
                                    c_reserved r,
                                    c_dayguest dg,
                                    c_overnight o,
                                    c_all a;
                        """, (all_params))  # repeat start/end 9 times for placeholders

                        data = cursor.fetchone()

                        count_result = {
                              'check_in': data.get('total_checkin'),
                              'overnight': data.get('total_overnight'),
                              'reserved': data.get('total_reserved'),
                              'day_guest': data.get('total_dayguest'),
                              'all': data.get('total_all')
                        }
                        
                        return {
                        "success": bool(new_data),
                        "data": new_data,
                        "count": count_result,
                        "total": total
                        }

            except Exception as e:
                  return {"success": False, "message": str(e)}

      def get_year_data(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT DISTINCT YEAR(check_in) AS year FROM bookings ''')
                        data = cursor.fetchall()

                        return {'years': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def summaryCardsData(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute('''
                              SELECT
                              -- Check-Ins today
                              COUNT(CASE WHEN booking_type IN ('Check-in', 'Day Guest') AND check_in = CURRENT_DATE() THEN 1 END) AS checkin_today,
                              SUM(CASE WHEN booking_type IN ('Check-in', 'Day Guest') AND check_in = CURRENT_DATE() THEN total_guest ELSE 0 END) AS checkin_guest_today,

                              -- Overnight today
                              COUNT(CASE WHEN booking_type IN ('Check-in') AND check_in = CURRENT_DATE() THEN 1 END) AS overnight,
                              SUM(CASE WHEN booking_type IN ('Check-in') AND check_in = CURRENT_DATE() THEN total_guest ELSE 0 END) AS guests_overnight,

                              -- Check-Outs today
                              SUM(CASE WHEN status IN ('Checked-out') AND check_out = CURRENT_DATE THEN total_guest ELSE 0 END) AS today_checkout_guests,
                              SUM(CASE WHEN booking_type = 'Day Guest' and DATE(check_out) = CURRENT_DATE() AND status = 'Checked-out' THEN 1 ELSE 0 END)     AS checkout_day_guest,
                              SUM(CASE WHEN booking_type = 'Check-in' and DATE(check_out) = CURRENT_DATE() AND status = 'Checked-out' THEN 1 ELSE 0 END)     AS checkout_overnight,
                              
                              -- Day Guests today
                              COUNT(CASE WHEN booking_type IN ('Day Guest') AND check_in = CURRENT_DATE THEN 1 END) AS day_guest,
                              SUM(CASE WHEN booking_type IN ('Day Guest') AND check_in = CURRENT_DATE THEN total_guest ELSE 0 END) AS day_guest_guests,

                              -- Upcoming Arrivals (future reservations)
                              COUNT(CASE WHEN status IN ("Reserved") AND date_book = CURRENT_DATE THEN 1 END) AS reservation,
                              SUM(CASE WHEN status IN ("Reserved") AND date_book =  CURRENT_DATE THEN total_guest ELSE 0 END) AS reservation_guest,

                              -- Cancelled Bookings (this month)
                              COUNT(CASE WHEN status = 'Cancelled' AND check_in >= CURRENT_DATE()
                                    THEN 1 END) AS cancelled,
                              SUM(CASE WHEN status = 'Cancelled' AND check_in >= CURRENT_DATE()
                                    THEN total_guest ELSE 0 END) AS cancelled_guest

                              FROM bookings;
                        ''')
                        data = cursor.fetchone()

                        cursor.execute(f''' 
                              WITH upcoming_arrivals AS (
                                    SELECT COUNT(*) AS total 
                                    FROM bookings 
                                    WHERE check_in >= CURRENT_DATE() and check_in < CURRENT_DATE() + INTERVAL 2 DAY
                                    AND status IN ('Reserved')
                              ), 
                              upcoming_checkouts AS ( 
                                    SELECT COUNT(*) AS total 
                                    FROM bookings 
                                    WHERE check_out >= CURRENT_DATE()
                                    AND check_out < CURRENT_DATE() + INTERVAL 2 DAY 
                                    AND status NOT IN ('Cancelled', 'Reserved', 'Checked-out')
                              )
                              SELECT 
                                    (SELECT total FROM upcoming_checkouts) AS checkouts,
                                    (SELECT total FROM upcoming_arrivals) AS arrivals;
                        ''')
                        
                        countData = cursor.fetchone()

                        return {
                              "today_checkin": data.get("checkin_today"),
                              "today_checkin_guests": data.get("checkin_guest_today"),
                              "overnight_count": data.get("overnight"),
                              "overnight_guests": data.get("guests_overnight"),
                              "today_checkout_guests": data.get("today_checkout_guests"),
                              "checkout_day_guest_count": data.get("checkout_day_guest"),
                              "checkout_overnight_count": data.get("checkout_overnight"),
                              "day_guest_count": data.get("day_guest"),
                              "day_guest_total": data.get("day_guest_guests"),
                              "upcoming_reservations": data.get("reservation"),
                              "upcoming_reservation_guests": data.get("reservation_guest"),
                              "cancelled_count": data.get("cancelled"),
                              "cancelled_guests": data.get("cancelled_guest"),
                              "arrivals": countData.get('arrivals'),
                              "checkouts": countData.get('checkouts')
                        }
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def mark_checkin(self, id, accomodation):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' UPDATE bookings SET status =%s where booking_id = %s ''', ("Checked-in", id))
                        con.commit()

                        parts = accomodation.split(',')
                        rooms = [ " ".join(p.strip().rsplit(" ", 1)[:-1]) for p in parts ]
                        room_no = [ p.split(' ')[-1] for p in parts ]

                        for room, number in set(zip(rooms, room_no)):
                              #if room not in ['cabana', 'small', 'big', 'pavillion', 'mariposa', 'minicon']:
                              cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("occupied", room, number))
                        con.commit()
                        
                        self.alert.generate_alerts()

                        return {'success': bool(cursor.rowcount != 0), 'message': 'Updated successfully!' if cursor.rowcount != 0 else 'Failed!'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def mark_checkout(self, id, accomodation):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' UPDATE bookings SET status = %s where booking_id = %s ''', ("Checked-out", id))

                        parts = accomodation.split(',')
                        room_dict = {}

                        for part in parts:
                              tokens = part.split(' ')  # split by space
                              room_type = tokens[0].lower()  # "Premium", "Garden", ...
                              room_dict[room_type] = part

                        rooms = [ " ".join(p.strip().rsplit(" ", 1)[:-1]) for p in parts ]
                        room_no = [ p.split(' ')[-1] for p in parts ]
                        now = datetime.now(timezone.utc)

                        cursor.execute(''' SELECT check_out FROM bookings WHERE booking_id = %s ''', (id,))
                        data = cursor.fetchone()
                        check_out = data.get('check_out')

                        if check_out < date.today():
                              for room, number in set(zip(rooms, room_no)):
                                    cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("avl", room, number))
                        else:
                              for room, number in set(zip(rooms, room_no)):
                                    cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("need-clean", room, number))
                                    cursor.execute(''' INSERT INTO notifications(name, date, room_name, room_no, alert_type) VALUES(%s, %s, %s, %s, %s) ''', (f'Housekeeping requested for {room} {number}.', now, room, number, 'housekeeping'))

                        con.commit()

                        self.alert.generate_alerts()

                        return {'success': bool(cursor.rowcount != 0), 'message': 'Check-out successfully!' if cursor.rowcount != 0 else 'Failed!'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def mark_paid(self, id, payment, date):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        
                        query = f"UPDATE bookings SET payment = '{payment}', paid_date = '{date}', total_amount = {'total_amount - (total_amount * 0.05)' if payment == 'ZUZU (Online Payment)' else 'total_amount'} where booking_id = {id} and paid_date IS NULL"
                        cursor.execute(query)
                        con.commit()

                        return {'success': bool(cursor.rowcount != 0), 'message': 'Updated successfully!' if cursor.rowcount != 0 else 'Failed!'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def cancel_booking(self, id, accomodation):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute(''' SELECT payment FROM bookings WHERE booking_id = %s ''', (id,))
                        data = cursor.fetchone()
                        payment = data.get('payment')

                        parts = accomodation.split(',')
                        rooms = [ " ".join(p.strip().rsplit(" ", 1)[:-1]) for p in parts ]
                        room_no = [ p.split(' ')[-1] for p in parts ]

                        for room, number in set(zip(rooms, room_no)):
                              cursor.execute('''UPDATE accomodation_spaces SET status = %s WHERE area_name=%s AND room=%s''', ("avl", room, number))
                              con.commit()

                        if payment.strip() != 'Pending':
                              cursor.execute(''' UPDATE bookings SET payment = %s, status = %s where booking_id = %s ''', ('Refunded', 'Cancelled', id))
                        else:
                              cursor.execute(''' UPDATE bookings SET payment = %s, status = %s where booking_id = %s ''', ('None', 'Cancelled', id))

                        cursor.execute(''' DELETE FROM area_revenue WHERE booking_id = %s ''', (id,))
                        con.commit()

                        self.alert.generate_alerts()
                        return {'success': bool(cursor.rowcount > 0), 'message': 'Cancelled successfully!' if cursor.rowcount > 0 else 'Failed!'}

            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def view_details(self, id):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT * FROM bookings where booking_id = %s ''', (id,))
                        data = cursor.fetchone()

                        return {'success': bool(data), 'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def get_reservation_date(self, id):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT check_in, check_out, booking_type, status, date_book FROM bookings where booking_id = %s ''', (id,))
                        data = cursor.fetchone()
                        
                        return {'check_in': data.get('check_in'), 'check_out': data.get('check_out'), 'booking_type': data.get('booking_type'), 'booking_status': data.get('status'), 'date_book': data.get('date_book')}
                  
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def get_data_to_update(self, id):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT accomodations, check_in, check_out FROM bookings WHERE booking_id = %s''', (id,))
                        data = cursor.fetchone()

                        return {'success': bool(data), 'checkin': data.get('check_in'), 'checkout': data.get('check_out'), 'accomodations': data.get('accomodations')}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def search_guest(self, guest_name, category, year, month, day=None):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        params = []
                        where_clause = ""

                        if month and day:
                              # YEAR + MONTH + DAY
                              start_date = date(int(year), int(month), int(day))
                              where_clause = "AND check_in = %s"
                              params.append(start_date)
                        elif month and not day:
                              # YEAR + MONTH
                              start_date = date(int(year), int(month), 1)

                              if int(month) == 12:
                                    end_date = date(int(year) + 1, 1, 1)
                              else:
                                    end_date = date(int(year), int(month) + 1, 1)

                              where_clause = "AND check_in >= %s AND check_in < %s"
                              params.extend([start_date, end_date])

                        # ---- BASE QUERY ----
                        sql = """
                              SELECT *
                              FROM bookings
                              WHERE name COLLATE utf8mb4_general_ci LIKE %s
                        """
                        params.insert(0, guest_name + "%")

                        sql += f" {where_clause}"

                        # Add category filters
                        if category != 'all-data':
                              if category == 'check_in-data':
                                    sql += ' AND status = "Checked-in"'
                              elif category == 'reserved-data':
                                    sql += ' AND status = "Reserved"'
                              elif category == 'overnight-data':
                                    sql += ' AND status IN ("Checked-out", "Checked-in") AND booking_type = "Check-in"'
                              elif category == 'day-guest':
                                    sql += ' AND booking_type = "Day Guest" and status IN ("Checked-out", "Checked-in") '

                        # Always order by check_in descending
                        sql += ' ORDER BY check_in DESC'

                        cursor.execute(sql, params)
                        data = cursor.fetchall()

                        new_data = []
                        for d in data: 
                              new_data.append({'booking_id': d.get('booking_id'), 'name': d.get('name'),  'date_book': d.get('date_book') , 'check_in': d.get('check_in'), 'check_out': d.get('check_out'), 'accomodations': d.get('accomodations'), 'booking_type': d.get('booking_type'), 'status': d.get('status'), 'stay': d.get('stay_gap'), 'payment': d.get('payment')})

                        return {'success': bool(new_data), 'data': new_data}

            except Exception as e:
                  con.rollback()
                  return {'success': False, 'message': f'Search failed: {e}'}

