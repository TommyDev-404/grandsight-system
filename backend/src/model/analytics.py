from forecast import Forecast
import random

class Analytics:
      def __init__(self, db):
            self.db = db
            self.revenue_forecast = Forecast()
      
      def occupancy(self, accomodation_type="All Resort Areas"):
            with self.db.connect() as con:
                  cursor = con.cursor()

                  area = self.get_all_area().get('data')
                  area_count = 0
                  for a in area:
                        area_count += int(a.get('area_count'))

                  # Build SUM(...) for all accommodation types dynamically
                  if accomodation_type == 'All Resort Areas':
                        sum_columns = [f"""
                              SUM(
                                    (LENGTH(accomodations) - LENGTH(REPLACE(accomodations, '{a.get('area_name').strip()}', ''))) 
                                    / LENGTH('{a.get('area_name').strip()}')
                              )
                              """  for a in area
                        ]
                        # Join them with + to get total sum
                        total_sum = " + ".join(sum_columns)
                  else:
                        total_sum = f"""
                              SUM(
                                    (LENGTH(accomodations) - LENGTH(REPLACE(accomodations, '{accomodation_type}', ''))) 
                                    / LENGTH('{accomodation_type}')
                              )
                        """

                  # Construct the final SQL query
                  occupancy_query = f"""
                        WITH current AS (
                        SELECT 
                              COALESCE(ROUND(
                                    COALESCE({total_sum}, 0) / {area_count} * 100,
                                    2
                              ), 0) AS occupancy
                        FROM bookings
                        WHERE check_in <= CURDATE() 
                              AND check_out >= CURDATE() 
                              AND status IN ('Checked-in','Day Guest')
                        ),
                        previous AS (
                        SELECT 
                              COALESCE(ROUND(
                                    COALESCE({total_sum}, 0) / {area_count} * 100,
                                    2
                              ), 0) AS occupancy
                        FROM bookings
                        WHERE check_in <= CURDATE() - INTERVAL 1 DAY 
                              AND check_out >= CURDATE() - INTERVAL 1 DAY
                              AND status IN ('Checked-in','Day Guest')
                        )
                        SELECT 
                        current.occupancy AS current_occupancy,
                        previous.occupancy AS previous_occupancy,
                        CASE
                              WHEN COALESCE(previous.occupancy,0) = 0 THEN 
                                    CASE WHEN current.occupancy > 0 THEN 100 ELSE 0 END
                              ELSE ROUND(
                                    (current.occupancy - previous.occupancy) / previous.occupancy * 100,
                                    2
                              )
                        END AS change_rate
                        FROM current, previous;
                  """
                  cursor.execute(occupancy_query)
                  occ_data = cursor.fetchone()
                  print("oCcupancy: ", occ_data)
            return {'data': occ_data}

      def analytics_metrics(self, accomodation_type):
            with self.db.connect() as con:
                  cursor = con.cursor()

                  # Occupancy Percentage
                  occ_data = self.occupancy(accomodation_type).get('data')

                  # --------- Daily Revenue ---------
                  #daily_cols = "pavillion + mariposa + minicon" if accomodation_type == "hall" else accomodation_type if accomodation_type.strip() != 'all' else "total"
                  additional_query = f" a.area = '{accomodation_type}' and "

                  daily_revenue_query = f"""
                        WITH today AS (
                              SELECT COALESCE(SUM(a.amount), 0) as total
                              FROM `area_revenue` a
                              JOIN bookings b
                              on a.booking_id = b.booking_id
                              WHERE {additional_query if accomodation_type != 'All Resort Areas' else ""} b.paid_date = CURRENT_DATE() AND b.payment NOT IN ('Pending')
                        ),
                        yesterday AS (
                              SELECT COALESCE(SUM(a.amount), 0) as total
                              FROM `area_revenue` a
                              JOIN bookings b
                              on a.booking_id = b.booking_id
                              WHERE {additional_query if accomodation_type != 'All Resort Areas' else ""} b.paid_date = CURRENT_DATE() - INTERVAL 1 DAY  AND b.payment NOT IN ('Pending')
                        )
                        SELECT 
                              today.total AS revenue_today,
                              yesterday.total AS prev_revenue,
                              CASE
                              WHEN yesterday.total=0 THEN CASE WHEN today.total>0 THEN 100 ELSE 0 END
                              ELSE ROUND((today.total - yesterday.total)/yesterday.total*100)
                              END AS change_rate
                        FROM today, yesterday;
                  """
                  cursor.execute(daily_revenue_query)
                  daily_data = cursor.fetchone()

                  # --------- Monthly Revenue ---------
                  #monthly_cols = "pavillion + mariposa + minicon" if accomodation_type == "hall" else accomodation_type if accomodation_type.strip() != 'all' else "total"
                  monthly_revenue_query = f"""
                        SELECT COALESCE(SUM(a.amount), 0) as total
                        FROM area_revenue a
                        JOIN bookings b ON a.booking_id = b.booking_id
                        WHERE {additional_query if accomodation_type != 'All Resort Areas' else ""}  MONTH(b.paid_date) = MONTH(CURDATE()) AND b.payment NOT IN ('Pending');
                  """
                  
                  cursor.execute(monthly_revenue_query)
                  monthly_data = cursor.fetchone()

                  # --------- Target Revenue ---------
                  if accomodation_type != 'All Resort Areas':
                        target_value = random.randrange(50_000, 150_001, 1_000)
                  else:
                        cursor.execute("""
                              WITH monthly_data AS (
                              SELECT YEAR(check_in) AS year, MONTH(check_in) AS month,
                                    SUM(total_amount) - SUM(total_guest*200) AS monthly_revenue
                              FROM bookings
                              WHERE status NOT IN ('Cancelled')
                              GROUP BY YEAR(check_in), MONTH(check_in)
                              )
                              SELECT ROUND(AVG(monthly_revenue),2) AS target_revenue FROM monthly_data;
                        """)
                        target_value = cursor.fetchone().get('target_revenue')
                        
                  monthly_change_rate = round((int(monthly_data.get('total')) / int(target_value)) * 100, 2) if target_value else 0

                  return {
                        'occupancy': {
                              'current': occ_data.get('current_occupancy'),
                              'previous': occ_data.get('previous_occupancy'),
                              'change': occ_data.get('change_rate')
                        },
                        'daily_revenue': {
                              'current': daily_data.get('revenue_today'),
                              'change': daily_data.get('change_rate')
                        },
                        'monthly_revenue': {
                              'current': monthly_data.get('total'),
                              'change': monthly_change_rate
                        },
                        'target_revenue': target_value
                  }

      def get_all_area(self):
            with self.db.connect() as con:
                  cursor = con.cursor()
                  cursor.execute("Select area_name, count(*) as area_count from accomodation_spaces GROUP by area_name ")
                  data = cursor.fetchall()

                  return { 'data': data }

      def forecast_checkin_revenue(self, accomodation_type):
            with self.db.connect() as con:
                  cursor = con.cursor()
                  
                  # --- Forecast Check-ins ---
                  if accomodation_type != 'All Resort Areas':
                        checkin_query = f"""
                              SELECT
                              check_in AS ds,
                              Round(SUM(
                                    (LENGTH(accomodations) - LENGTH(REPLACE(accomodations, '{accomodation_type.strip()}', ''))) 
                                    / LENGTH('{accomodation_type.strip()}')
                              ), 0) AS y
                              FROM bookings
                              GROUP BY check_in
                              ORDER BY check_in;
                        """
                  else:
                        area = self.get_all_area().get('data')

                        sum_columns = [f"""
                              SUM(
                                    (LENGTH(accomodations) - LENGTH(REPLACE(accomodations, '{a.get('area_name').strip()}', ''))) 
                                    / LENGTH('{a.get('area_name').strip()}')
                              )
                              """  for a in area
                        ]

                        total_sum = " + ".join(sum_columns)

                        checkin_query = f"""
                              SELECT
                                    check_in AS ds,
                                    ROUND({total_sum}, 0) AS y
                              FROM bookings
                              GROUP BY check_in
                              ORDER BY check_in;
                        """

                  cursor.execute(checkin_query)
                  checkin_data = cursor.fetchall()
                  checkin_dates = [row.get('ds') for row in checkin_data]
                  checkin_values = [row.get('y') for row in checkin_data]
                  forecast_checkin = self.revenue_forecast.forecast_checkin(checkin_dates, checkin_values)
                  
                  # --- Forecast Revenue ---
                  if accomodation_type != 'All Resort Areas':
                        revenue_query = f"""
                              SELECT
                                    check_in AS ds,
                                    Round(SUM(
                                          (LENGTH(accomodations) - LENGTH(REPLACE(accomodations, '{accomodation_type.strip()}', ''))) 
                                          / LENGTH('{accomodation_type.strip()}')
                                    ), 0) * {self.area_price(accomodation_type)} + SUM(total_guest * 200) AS y
                              FROM bookings
                              WHERE status != 'Cancelled'
                              GROUP BY check_in
                              ORDER BY check_in;
                        """
                  else:
                        revenue_query = """
                              SELECT check_in AS ds,
                                    SUM(total_amount) AS y
                              FROM bookings
                              WHERE status != 'Cancelled'
                              GROUP BY check_in;
                        """

                  cursor.execute(revenue_query)
                  revenue_data = cursor.fetchall()
                  revenue_dates = [row.get('ds') for row in revenue_data]
                  revenue_values = [row.get('y') for row in revenue_data]
                  forecast_revenue = self.revenue_forecast.forecast_revenue(revenue_dates, revenue_values)

                  # Return both together
                  return {
                        'forecast_checkin': forecast_checkin,
                        'forecast_revenue': forecast_revenue
                  }

      def area_price(self, query):
            with self.db.connect() as con:
                  cursor = con.cursor()
            
                  cursor.execute(""" SELECT rate FROM accomodation_spaces WHERE area_name = %s """, (query,))
                  data = cursor.fetchone()
                  
                  return data.get('rate')

      def analytics_stats(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        occ_data = self.occupancy_forecast().get('data')

                        # -------------------------------
                        # 2️⃣ Heavy guest per month
                        cursor.execute('''
                              SELECT 
                                    MONTH(check_in) AS month,
                                    SUM(total_guest) AS total_guest
                              FROM bookings
                              GROUP BY MONTH(check_in)
                              ORDER BY MONTH(check_in);
                        ''')
                        heavy_data = cursor.fetchall()
                        heavy_month = [d.get('month') for d in heavy_data]
                        heavy_values = [int(d.get('total_guest')) for d in heavy_data]

                        heavy_guest = {'month': heavy_month, 'value': heavy_values}

                        # -------------------------------
                        area = self.get_all_area().get('data')

                        sum_columns = [f" SUM(accomodations LIKE '%{a.get('area_name')}%') as {a.get('area_name').split(' ')[0]}" for a in area]

                        most_booked_query = f"""
                              SELECT
                                    {", ".join(sum_columns)}
                              FROM bookings
                        """
                        cursor.execute(most_booked_query)
                        data = cursor.fetchall()

                        area = self.get_all_area().get("data")
                        most_booked = []

                        for d in data:                     # each SQL row
                              for a in area:                # each area
                                    name = a.get("area_name")
                                    key = name.split(" ")[0] # Premium, Garden, etc

                                    most_booked.append({ "area": name, 'value': d.get(key) })

                  # Prepare combined response
                  return {
                        'success': True,
                        'occupancy_forecast': occ_data,
                        'heavy_guest_month': heavy_guest,
                        'most_booked_area': most_booked
                  }


            except Exception as e:
                  return ({'success': False, 'message': f'Query failed: {e}'})

      def occupancy_forecast(self):
            with self.db.connect() as con:
                  cursor = con.cursor()

                  #  Forecast occupancy
                  cursor.execute("""
                        SELECT
                              check_in AS ds,
                              ROUND(SUM(LENGTH(REPLACE(accomodations, ' ', '')) 
                                    - LENGTH(REPLACE(REPLACE(accomodations, ' ', ''), ',', '')) + 1
                              ) / 54 * 100, 2) AS y
                        FROM bookings
                        GROUP BY check_in
                        ORDER BY check_in;
                  """)

                  occupancy_data = cursor.fetchall()
                  occupancy_dates = [row.get('ds') for row in occupancy_data]
                  occupancy_values = [row.get('y') for row in occupancy_data]
                  occupancy_forecast = self.revenue_forecast.forecast_occupancy(occupancy_dates, occupancy_values)

                  return {'data': occupancy_forecast, 'ds': occupancy_dates, 'y': occupancy_values}

      def accomodation_count (self, area_name):
            with self.db.connect() as con:
                  cursor = con.cursor()
                  
                  if area_name == 'hall':
                        cursor.execute('SELECT COUNT(id) AS count from accomodation_spaces where name in ("pavillion", "mariposa", "minicon")')
                  else:
                        cursor.execute('SELECT COUNT(id) AS count from accomodation_spaces where name = %s ', (area_name,))

                  data = cursor.fetchone()

                  return data.get('count')
