import re

class RatesAndAvailability:
       def __init__(self, db):
              self.db = db
       
       def availables(self):
              try:
                     with self.db.connect() as con:
                            cursor = con.cursor()
                            cursor.execute('''
                                   SELECT 
                                          s.area_name,
                                          category,
                                          COUNT(s.id) AS total_rooms,
                                          COALESCE(MAX(s.rate), 0) AS rate,
                                          COALESCE(MAX(s.orig_rate), 0) AS orig_rate,
                                          SUM(CASE WHEN s.status='avl' THEN 1 ELSE 0 END) AS available,
                                          SUM(CASE WHEN s.status='occupied' THEN 1 ELSE 0 END) AS occupied,
                                          SUM(CASE WHEN s.status='reserved' THEN 1 ELSE 0 END) AS reserve,
                                          SUM(CASE WHEN s.status='need-clean' THEN 1 ELSE 0 END) AS need_clean,
                                          SUM(CASE WHEN s.status='on-clean' THEN 1 ELSE 0 END) AS on_clean,
                                          MAX(s.capacity) AS capacity,
                                          s.promo
                                   FROM accomodation_spaces s
                                   GROUP BY s.area_name 
                                   ORDER BY FIELD(category, 'Room', 'Cottage', 'Hall') ASC
                            ''')
                            data = cursor.fetchall()
              
                     return {"area": data}  # or just return result if you don't want the wrapper

              except Exception as e:
                     con.rollback()
                     return { 'success': False, 'message': f'Cancellation failed: {e}'}

       def availability_metrics(self):
              try:
                     with self.db.connect() as con:
                            cursor = con.cursor()

                            cursor.execute("""
                                   SELECT
                                          COALESCE(COUNT(*),0) AS total_area,
                                          COALESCE(SUM(status = 'need-clean'),0) AS today_need_clean,
                                          SUM(CASE WHEN status = 'avl' THEN 1 ELSE 0 END) AS available,
                                          SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) AS occupied,
                                          SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserve
                                   FROM accomodation_spaces
                            """)

                            metrics = cursor.fetchone()
                            return metrics

              except Exception as e:
                     return {
                     "success": False,
                     "message": str(e)
                     }

       def update_area(self, area_name, category, total_area, price, capacity, prev_area_name):
              try:
                     with self.db.connect() as con:
                            cursor = con.cursor()

                            # get all the booking record from db based on area that you want to change area name
                            cursor.execute('''
                                   SELECT accomodations, promo_area, booking_id
                                   FROM bookings
                                   WHERE accomodations LIKE %s
                            ''', ("%" + prev_area_name + "%", ))
                            area_affected = cursor.fetchall()

                            area_fName = prev_area_name.split(' ')[0].strip() # get the first word of the previous area name

                            # UPDATE AREA NAME IN BOOKING TABLE
                            for a in area_affected: # loop in each booking record
                                   bid = a.get('booking_id') # get the id
                                   db_area = a.get('accomodations').split(', ') # get all the accomodations in one booking record
                                   promo_areas = a.get('promo_area').split(', ')

                                   updated_accomodations = [] # store all the area in one accomodation together with the changed one
                                   updated_promo_area = []

                                   for dba in db_area:  # update the accomodation name
                                          match = re.search(r'(\d+)$', dba)  # \d+ = one or more digits, $ = end of string
                                          room_no = int(match.group(1)) if match else None

                                          # rename all the previous area with the new one including all in the database
                                          if area_fName in dba:
                                                 updated_accomodations.append(area_name + " " + str(room_no) if room_no else area_name) 
                                          else:
                                                 updated_accomodations.append(dba)

                                   for pa in promo_areas: # update the promo area name
                                          match = re.search(r'(\d+)$', pa)  # \d+ = one or more digits, $ = end of string
                                          room_no = int(match.group(1)) if match else None

                                          # rename all the previous area with the new one including all in the database
                                          if area_fName in pa:
                                                 updated_promo_area.append(area_name + " " + str(room_no) if room_no else area_name) 
                                          else:
                                                 updated_promo_area.append(pa)

                                   cursor.execute(''' UPDATE bookings SET accomodations = %s, promo_area = %s WHERE booking_id = %s ''', (", ".join(updated_accomodations), ", ".join(updated_promo_area), bid ))

                            cursor.execute(''' SELECT id, area FROM `promos` where end_date > CURRENT_DATE() ''')
                            area_under_promo = cursor.fetchall()      
                            
                            # UPDATE AREA NAME IN PROMOTIONS TABLE
                            for ap in area_under_promo:
                                   pid = ap.get('id')
                                   areas = ap.get('area').split(',')

                                   new_area_under_promo = []
                                   for a in areas: 
                                          if area_fName in a:
                                                 new_area_under_promo.append(area_name)
                                          else:
                                                 new_area_under_promo.append(a)

                                   cursor.execute(''' UPDATE promos SET area = %s WHERE id = %s ''', (", ".join(new_area_under_promo), pid ))

                            cursor.execute(''' SELECT id, area FROM `area_revenue` ''')
                            area_from_area_revenue = cursor.fetchall()

                            # UPDATE AREA NAME IN AREA REVENUE TABLE
                            for ar in area_from_area_revenue:
                                   rid = ar.get('id')
                                   areas = ar.get('area').split(',')

                                   updated_area_revenue = []
                                   for a in areas: 
                                          if area_fName in a:
                                                 updated_area_revenue.append(area_name)
                                          else:
                                                 updated_area_revenue.append(a)

                                   cursor.execute(''' UPDATE area_revenue SET area = %s WHERE id = %s ''', (", ".join(updated_area_revenue), rid ))

                            cursor.execute(''' SELECT id, room FROM `room_assign_history` ''')
                            area_cleaned = cursor.fetchall()

                            # UPDATE AREA NAME IN ROOM ASSIGN HISTORY TABLE
                            for ac in area_cleaned:
                                   cid = ac.get('id')
                                   areas = ac.get('room').split(',')

                                   updated_area_cleaned = []
                                   for a in areas: 
                                          if area_fName in a:
                                                 updated_area_cleaned.append(area_name)
                                          else:
                                                 updated_area_cleaned.append(a)

                                   cursor.execute(''' UPDATE room_assign_history SET room = %s WHERE id = %s ''', (", ".join(updated_area_cleaned), cid ))

                            # 1. Update existing rows
                            cursor.execute("""
                                   UPDATE accomodation_spaces SET rate = %s, orig_rate = %s, area_name = %s, capacity = %s, category = %s WHERE area_name = %s
                            """, (price, price, area_name, capacity, category, prev_area_name))

                            # 2. Get current count + max room
                            cursor.execute("""
                                   SELECT COUNT(*) AS count,
                                          COALESCE(MAX(room), 0) AS max_room
                                   FROM accomodation_spaces
                                   WHERE area_name = %s
                            """, (area_name,))

                            area = cursor.fetchone()

                            current = int(area['count'])
                            max_room = int(area['max_room'])
                            desired = int(total_area)

                            # 3. DELETE extra rows
                            if desired < current:
                                   gap = current - desired

                                   cursor.execute(f""" DELETE FROM accomodation_spaces WHERE area_name = '{area_name}' ORDER BY room DESC LIMIT {gap} """)

                            # 4. INSERT missing rows
                            elif desired > current:
                                   gap = desired - current

                                   for i in range(1, gap + 1):
                                          cursor.execute("""
                                                 INSERT INTO accomodation_spaces (area_name, category, room, rate, orig_rate, capacity, status, promo) VALUES (%s, %s, %s, %s, %s, %s, 'avl', 'None')
                                          """, (area_name, category, max_room + i, price, price, capacity))

                            con.commit()

                            return {
                                   'success': True,
                                   'message': 'Area updated successfully!'
                            }

              except Exception as e:
                     con.rollback()
                     return {
                            'success': False,
                            'message': str(e)
                     }

       def add_area(self, area_name, category, total_area, price, capacity):
              try:
                     with self.db.connect() as con:
                            cursor = con.cursor()

                            total = int(total_area)

                            # Check if area already exists
                            cursor.execute("""
                                   SELECT COUNT(*) AS count FROM accomodation_spaces WHERE area_name = %s
                            """, (area_name,))

                            exists = cursor.fetchone()['count']

                            if exists > 0:
                                   return { 'success': False, 'message': 'Area already exists!'}

                            # Insert rooms
                            for room in range(1, total + 1):
                                   cursor.execute("""
                                          INSERT INTO accomodation_spaces (area_name, category, room, rate, orig_rate, capacity, status, promo) VALUES (%s, %s, %s, %s, %s, %s, 'avl', 'None')
                                   """, ( area_name, category, (100 + room), price, price, capacity ))

                            con.commit()

                     return {
                            'success': True,
                            'message': 'Area added successfully!'
                     }

              except Exception as e:
                     con.rollback()
                     return {
                            'success': False,
                            'message': str(e)
                     }

       def remove_area(self, area_name):
              with self.db.connect() as con:
                     cursor = con.cursor()

                     cursor.execute("DELETE FROM accomodation_spaces WHERE area_name = %s", (area_name,))
                     con.commit()

                     return { "success": bool(cursor.rowcount > 0), "message": 'Area removed successfully!' if cursor.rowcount > 0 else "Failed to remove! Something went wrong." }
