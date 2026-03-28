from datetime import date, datetime

class RevenueMgmt:
      def __init__(self, db, alert, reserve):
            self.db = db
            self.alert = alert
            self.reservation_model = reserve

      def apply_promo(self, promo_name, promo_rate, start, end, areas_promo):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        promo_start = datetime.strptime(start, "%Y-%m-%d").date()
                        promo_end = datetime.strptime(end, "%Y-%m-%d").date()
                        discount = float(promo_rate) / 100
                        areas = [a.strip() for a in areas_promo.split(',')]
                        promo_label = f"{promo_name} - {promo_rate}%"

                        status = 'Expired' if promo_end < date.today() else 'Active'

                        # 1️⃣ Insert promo
                        cursor.execute('''
                              INSERT INTO promos(start_date, name, discount, area, end_date, status)
                              VALUES (%s, %s, %s, %s, %s, %s)
                        ''', (start, promo_label, promo_rate, ",".join(areas), end, status))

                        if promo_end > date.today():
                              # Apply promo
                              cursor.execute(f'''
                                    UPDATE accomodation_spaces
                                    SET promo = %s,
                                    rate = orig_rate * (1 - %s)
                                    WHERE area_name IN ({','.join(['%s'] * len(areas))})
                              ''', [promo_label, discount, *areas])
                        else:
                              # reset price to orig rate
                              cursor.execute(f'''
                                    UPDATE accomodation_spaces
                                    SET promo = %s,
                                    rate = orig_rate 
                                    WHERE area_name IN ({','.join(['%s'] * len(areas))})
                              ''', ['None', *areas])

                        con.commit()

                        #  Find affected bookings
                        cursor.execute('''
                              SELECT booking_id, accomodations, check_in, check_out, booking_type, accomodations, total_guest, payment
                              FROM bookings
                              WHERE status NOT IN ('Cancelled')
                              AND check_out >= %s 
                        ''', (promo_start,))
                        bookings = cursor.fetchall()

                        if bookings:
                              booking_areas  = []    
                              for b in bookings:
                                    for a in b['accomodations'].split(','):
                                          booking_areas.append(a.strip())

                              # get the area affected of each booking based on the area that is under promo
                              affected = [area  for area in booking_areas if " ".join(area.rsplit(' ')[:-1]) in areas ]

                              if affected:
                                    for ba in bookings:
                                          # Recalculate booking totals safely
                                          self.reservation_model.update_reservation_date(
                                                ba['booking_id'],
                                                str(ba['check_in']),
                                                str(ba['check_out']), 
                                                ba.get('booking_type'),
                                                ba.get('accomodations'),
                                                ba.get('total_guest'),
                                                ba.get('payment')
                                          )

                        return {
                              'success': True,
                              'message': 'Promotion applied successfully'
                        }

            except Exception as e:
                  con.rollback()
                  return {
                        'success': False,
                        'message': f'Promo application failed: {e}'
                  }

      def update_promo(self, id, promo_name, promo_rate, start, end, areas_promo, prev_area):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        
                        promo_start = datetime.strptime(start, "%Y-%m-%d").date()
                        promo_end = datetime.strptime(end, "%Y-%m-%d").date()
                        discount = float(promo_rate) / 100
                        areas = [a.strip() for a in areas_promo.split(',')]
                        promo_label = f"{promo_name} - {promo_rate}%"
                        prev_areas = prev_area.split(',')
                        
                        for area in prev_areas:
                              cursor.execute(''' UPDATE accomodation_spaces SET promo = %s, rate = orig_rate WHERE area_name = %s ''', ("None", area))
                              con.commit()

                        status = 'Active'  if promo_end >= date.today() else  'Expired'

                        # 1️⃣ Update promo
                        cursor.execute(''' UPDATE promos SET start_date = %s, name = %s, discount = %s, area = %s, end_date = %s, status = %s WHERE id = %s''', (start, promo_label, promo_rate, ",".join(areas), end, status, id))
                        promo_updated = cursor.rowcount > 0

                        # 2️⃣ Update accommodation prices (FROM BASE RATE)
                        cursor.execute(f'''
                              UPDATE accomodation_spaces
                              SET promo = %s,
                              rate = orig_rate * (1 - %s)
                              WHERE area_name IN ({','.join(['%s'] * len(areas))})
                        ''', [promo_label, discount, *areas])
                        con.commit()

                        # 3️⃣ Find affected bookings
                        cursor.execute('''
                              SELECT booking_id, accomodations, check_in, check_out, booking_type, accomodations, total_guest, payment
                              FROM bookings
                              WHERE status NOT IN ('Cancelled')
                              AND check_out >= %s 
                        ''', (promo_start))
                        bookings = cursor.fetchall()

                        booking_areas  = []
                        for b in bookings:
                              for a in b['accomodations'].split(','):
                                    booking_areas.append(a.strip())

                        for b in bookings:
                              cursor.execute(''' UPDATE bookings SET  promo  = %s, promo_area = %s WHERE booking_id = %s ''', ('No promo.', 'No accomodations under promo.', b['booking_id']))
                        con.commit()

                        affected = []
                        for area in booking_areas:
                              area_name = " ".join(area.rsplit(' ')[:-1])
                              if area_name in areas:
                                    affected.append(area)

                        if affected:
                              for ba in bookings:
                                    # Recalculate booking totals safely
                                    self.reservation_model.update_reservation_date(
                                          ba['booking_id'],
                                          str(ba['check_in']),
                                          str(ba['check_out']),
                                          ba['booking_type'], 
                                          ba['accomodations'], 
                                          ba['total_guest'], 
                                          ba['payment']
                                    )

                        return {
                              'success': promo_updated,
                              'message': "Promotions updated successfully" if promo_updated else "No changes were made to the promotion."
                        }

            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def get_promo_data(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute("SELECT * FROM promos ORDER BY end_date DESC;")
                        promos = cursor.fetchall()

                        result = {'success': bool(promos), 'data': promos}

                        return result
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def remove_promo(self, id, areas_promo):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        areas = areas_promo.split(',')
                        
                        cursor.execute(''' SELECT start_date, end_date FROM promos WHERE id = %s''', (id,))
                        promo_data = cursor.fetchone()

                        if promo_data.get('end_date') >= date.today():
                              # remove the promo price and name
                              placeholders = ','.join(['%s'] * len(areas)) # create a placeholder base on the areas length
                              query = f'''
                                    UPDATE accomodation_spaces
                                    SET promo = 'None', rate = orig_rate
                                    WHERE area_name IN ({placeholders})
                              '''

                              cursor.execute(query, [area.strip() for area in areas])
                              con.commit()

                              # get the bookings under promo scope
                              cursor.execute(''' SELECT booking_id, accomodations, check_in, check_out, booking_type, total_guest, payment FROM bookings WHERE check_out >= %s and status NOT IN ('Cancelled') ''', (promo_data.get('start_date')))
                              booking_data = cursor.fetchall()

                              for data in booking_data: # check booking
                                    accomodations = data.get('accomodations').split(', ')
                                    bid = data.get('booking_id')

                                    # check if the accomodations in booking is under promotions
                                    area_under_promo = [ area.strip() for area in accomodations if " ".join(area.split(' ')[:-1]).strip() in areas ]
                                    
                                    if len(area_under_promo) > 0: # mark no promo in each booking
                                          cursor.execute(''' UPDATE bookings SET  promo  = %s, promo_area = %s WHERE booking_id = %s ''', 
                                          ('No promo.', 'No accomodations under promo.', bid))
                                          con.commit()

                                    # update the price of the booking
                                    self.reservation_model.update_reservation_date(bid, str(data.get('check_in')), str(data.get('check_out')), data.get('booking_type'), data.get('accomodations'), data.get('total_guest'), data.get('payment'), 'remove')
                        
                        cursor.execute(''' DELETE FROM promos WHERE id = %s''', (id))
                        con.commit()

                        return {'success': bool(cursor.rowcount != 0), 'message': "Promotions remove successfully" if bool(cursor.rowcount != 0) else "Failed to remove promotions."}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def get_promo_area(self, id):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute("SELECT area FROM promos WHERE id = %s;", (id,))
                        promos = cursor.fetchone()
                        
                        return {'success': bool(promos), 'data': promos.get('area')}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      