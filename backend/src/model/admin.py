import bcrypt
import re
from .email_sender import OTPVerification
from datetime import date
from flask import session

class Admin:
      def __init__(self, db):
            self.db = db
            self.otp_sender = OTPVerification(db)

      def changePass(self, email, new_password):
            try:
                  with self.db.connect() as con:
                        # validate email format
                        email_validation = self.is_valid_email(email)
                        if not email_validation: return {'message': 'Invalid email!'}

                        # input passwords
                        input_bytes_new = new_password.encode('utf-8')
                        
                        hashed_new = bcrypt.hashpw(input_bytes_new, bcrypt.gensalt())

                        result = self.otp_sender.verify_acc(email)
                        if result.get('success'):
                              print('Success...', result)
                              #store temporary
                              session["new_pass"] = new_password
                              session["email"] = email
                              session["new_hash"] = hashed_new
                              session["verification_code"] = result.get("code")

                              return {'success': True,'message': "We've sent you a 6-digit code in your email to verify its you."}
                        else:
                              return {'success': False, 'message': result.get('message')}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
            
      def changePassv2(self, code):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()

                        if str(code.get('code')) == str(session.get('verification_code')):
                              cursor.execute('''
                                    UPDATE admin SET password = %s, hash_pass = %s, date_pass_change = %s WHERE email = %s
                              ''', (session.get('new_pass'), session.get('new_hash'), date.today(), session.get('email')))
                              con.commit()

                              return {'success': bool(cursor.rowcount != 0), 'message' : "Password changed successfully!" if bool(cursor.rowcount != 0) else 'Failed to change password.'}
                        else:
                              return {'success': False, 'message' : "Incorrect code! Bleh"}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
      
      def edit_info(self, info, modalType, id):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        query = f"UPDATE admin SET {modalType.lower()} = %s WHERE id = %s"
                        cursor.execute(query, (info, id))
                        con.commit()

                        return { 'success': bool(cursor.rowcount != 0), 'message': f"{modalType.capitalize()} changed successfully!" if bool(cursor.rowcount != 0) else f'Failed to change{modalType}.'}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
            
      def get_admin_profile(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT username, email, contact, date_pass_change, id FROM admin''')
                        data = cursor.fetchone()

                        return { 'success': bool(data), 'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}
            
      def admin_username(self):
            try:
                  with self.db.connect() as con:
                        cursor = con.cursor()
                        cursor.execute(''' SELECT username FROM admin''')
                        data = cursor.fetchone()

                        return {'data': data}
            except Exception as e:
                  con.rollback()
                  return { 'success': False, 'message': f'Cancellation failed: {e}'}

      def is_valid_email(self, email):
            pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            return re.match(pattern, email) is not None

