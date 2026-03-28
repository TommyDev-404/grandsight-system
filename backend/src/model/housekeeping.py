from collections import Counter
from datetime import date, datetime

class Housekeeping:
      def __init__(self, db, alert):
            self.db = db
            self.alert = alert

      def housekeeping_area_status(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute('''
                              SELECT 
                                    area_name,
                                    COUNT(area_name) as total_room,
                                    SUM(CASE WHEN status IN ("need-clean") THEN 1 ELSE 0 END) AS need_clean,
                                    SUM(CASE WHEN status IN ("avl") THEN 1 ELSE 0 END) AS ready,
                                    SUM(CASE WHEN status IN ("on-clean") THEN 1 ELSE 0 END) AS on_clean
                              FROM accomodation_spaces
                              GROUP BY area_name 
                        ''')
                        data = cursor.fetchall()

                  return {'success': bool(data), 'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def housekeeping_metrics(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute('''
                              SELECT 
                                    COUNT(area_name) AS total_rooms,
                                    SUM(CASE WHEN status IN ('need-clean') THEN 1 ELSE 0 END) AS total_need_clean,
                                    SUM(CASE WHEN status IN ('avl') THEN 1 ELSE 0 END) AS total_ready,
                                    SUM(CASE WHEN status IN ('on-clean') THEN 1 ELSE 0 END) AS total_on_clean
                              FROM accomodation_spaces;
                        ''')
                        data = cursor.fetchone()

                        return {'need_clean': data.get('total_need_clean'), 'ready': data.get('total_ready'), 'on_clean': data.get('total_on_clean')}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def area_details(self, accomodation):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute('''
                              SELECT room, status  FROM accomodation_spaces WHERE area_name = %s
                        ''', (accomodation,))
                        data = cursor.fetchall()

                        result = {'data': data}

                        return result
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def assign_cleaner(self, area_name, room_no, cleaner_name, date):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute('''
                              UPDATE accomodation_spaces SET status = %s WHERE area_name = %s AND room = %s
                        ''', ('on-clean', area_name, room_no))
      
                        room = f'''{area_name} {room_no}'''
                        cursor.execute('''
                              INSERT INTO room_assign_history(name, date, room, status) VALUES(%s, %s, %s, %s)
                        ''', (cleaner_name, date, room, 'on-clean'))
            
                        cursor.execute('''
                              DELETE FROM notifications WHERE room_name = %s AND room_no = %s
                        ''', (area_name, room_no))
                        
                        con.commit()

                        return {'success': bool(cursor.rowcount > 0), 'message': 'Assigned successfully!' if bool(cursor.rowcount > 0) else 'Failed inserting data!'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def update_room_condition(self, room_no, area_name):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute('''
                              UPDATE accomodation_spaces SET status = %s WHERE area_name = %s AND room = %s
                        ''', ('avl', area_name, room_no))
                        
                        room = f'''{area_name} {room_no}'''
                        cursor.execute(''' UPDATE room_assign_history SET status = %s WHERE room = %s ''', ('avl', room))

                        con.commit()
                        
                        return {'success': bool(cursor.rowcount > 0), 'message': 'Marked ready successfully!' if bool(cursor.rowcount > 0) else 'Failed inserting data!'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def staff_cleaners(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' 
                              SELECT staff_name
                              FROM staff_details st
                              JOIN staff_attendance sa
                              ON st.id = sa.staff_id 
                              WHERE st.job_position NOT IN ('Front Desk', 'Security Guard') AND sa.date = CURRENT_DATE()
                              AND sa.status NOT IN ('Absent')
                        ''')
                        data = cursor.fetchall()

                        return {'success': bool(data), 'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def room_assigned_history(self, room):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        cursor.execute(''' SELECT date, name FROM room_assign_history WHERE room = %s ORDER BY date DESC''', (room,))
                        data = cursor.fetchall()

                        return {'success': bool(data), 'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
            from datetime import date

      def cleaning_history(self, month, day):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        target_date = date(date.today().year, int(month), int(day))

                        cursor.execute('''
                        SELECT * 
                        FROM room_assign_history 
                        WHERE date = %s
                        ''', (target_date,))
                        
                        data = cursor.fetchall()

                        return {'success': bool(data), 'data': data}

            except Exception as e:
                  con.rollback()
                  return {'success': False, 'message': f'Query failed: {e}'}