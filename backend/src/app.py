import pymysql
from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, jwt_required)
from model import Database, Dashboard, Analytics, Reservation, Housekeeping, RatesAndAvailability, Accounting, Alerts, RevenueMgmt, Admin, Login, Staff_Management

# -------------------- APP SETUP -------------------- #
app = Flask(__name__)
app.secret_key = 'ilabu123456789abcdefghi'

# JWT CONFIG
app.config["JWT_SECRET_KEY"] = "super-secret-key-for-dev-abcd-efgh-ijklm-nopq-rstu-vwxy-z123-4567-8910-1112"  # keep consistent
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
jwt = JWTManager(app)

# CORS (React / Vite)
CORS(  app, origins=["http://localhost:5173"], supports_credentials=True)

# Create DB object once here
db = Database( 
      host="db", 
      user="root", 
      password="root", 
      database="resort_db", 
      port=3306, 
      cursor=pymysql.cursors.DictCursor 
)

# create instances of classes
admin = Admin(db)
analytics = Analytics(db)
alert = Alerts(db, analytics.occupancy_forecast)
avl = RatesAndAvailability(db)
acc = Accounting(db)
dashboard = Dashboard(db, analytics.occupancy, analytics.get_all_area)
reserve = Reservation(db, alert, dashboard, analytics.get_all_area)
house = Housekeeping(db, alert)
rev = RevenueMgmt(db, alert, reserve)
staff = Staff_Management(db, house)
login = Login(db)


#------------------ LOGIN API ------------------#
@app.route("/api/login", methods=["POST"])
def login_auth():
      data = request.get_json()
      result = login.login(**data)
      if not result["success"]:
            return jsonify(result)

      token = result["token"] 
      response = jsonify({
            "success": True,
            "message": "Login successfully!",
            "access_token": token
      })
      return response


#------------------ FORGOT PASSWORD API ------------------#
@app.route('/api/forgot-password', methods=['POST'])
def forgot_pass():
      return jsonify(login.forgot_pass(request.get_json()))

@app.route('/api/forgot-password/code-verification', methods=['POST'])
def verify_code():
      return jsonify(login.check_code(request.get_json()))

#------------------ CHANGE PASSWORD API ------------------#
@app.route('/api/change-password', methods=['POST'])
def change_password():
      return jsonify(login.changePass(request.get_json()))

#------------------ ALERTS ------------------#
@app.route('/api/notification/all-notification', methods=['GET'])
@jwt_required()
def all_notifications():
      return jsonify(alert.notifications())


#------------------ DASHBOARD ------------------#
@app.route('/api/dashboard/booking-count', methods=['GET'])
@jwt_required()
def dashboard_booking_count():
      return jsonify(dashboard.booking_data_count())

@app.route('/api/dashboard/upcoming-bookings', methods=['GET'])
@jwt_required()
def upcoming_bookings():
      return jsonify(dashboard.upcoming_bookings(request.args.get('book_type'), request.args.get('day')))

@app.route('/api/dashboard/live-operations', methods=['GET'])
def dashboar_metrics():
      return jsonify(dashboard.dashboard_metrics_1())

@app.route('/api/dashboard/today-activity', methods=['GET'])
@jwt_required()
def dashboar_metrics2():
      return jsonify(dashboard.dashboard_metrics_2())

@app.route('/api/dashboard/booking-trend', methods=['GET'])
@jwt_required()
def dashboard_booking_trend():
      return jsonify(dashboard.booking_trends())

@app.route('/api/dashboard/booking-statistics', methods=['GET'])
@jwt_required()
def dashboard_booking_statistics():
      return jsonify(dashboard.dashboard_booking_stats())


#----------------- ANALYTICS ------------------#
@app.route('/api/analytics/metric-data', methods=['GET'])
@jwt_required()
def analytics_metrics():
      return jsonify(analytics.analytics_metrics(request.args.get('accomodation_type')))

@app.route('/api/analytics/forecast-checkin-revenue', methods=['GET'])
@jwt_required()
def forecast_checkin_revene():
      return jsonify(analytics.forecast_checkin_revenue(request.args.get('accomodation_type')))

@app.route('/api/analytics/statistics', methods=['GET'])
def analytics_stats():
      return jsonify(analytics.analytics_stats())

@app.route('/api/analytics/get-all-area', methods=['GET'])
@jwt_required()
def get_all_area():
      return jsonify(analytics.get_all_area())


#--------------- ALL RESERVATION ------------------#
@app.route('/api/booking/avl-spaces', methods=['GET'])
def avl_spaces():
      return jsonify(reserve.get_avl_spaces())

@app.route('/api/booking/summary-cards-data', methods=['GET'])
@jwt_required()
def summary_cards_data():
      return jsonify(reserve.summaryCardsData())

@app.route('/api/booking/avl-area-name', methods=['GET'])
@jwt_required()
def avl_rooms_all():
      return jsonify(reserve.get_avl_room(request.args.get('area_name')))

@app.route('/api/booking/add-booking', methods=['POST'])
@jwt_required()
def add_booking():
      return jsonify(reserve.add_booking(**request.get_json()))

@app.route('/api/booking/bookings-data', methods=['GET'])
@jwt_required()
def bookings_data():
      return jsonify(reserve.bookings_data(request.args.get('category'),  request.args.get('page'), request.args.get('year'), request.args.get('month'), request.args.get('day')))

@app.route('/api/booking/get-years', methods=['GET'])
@jwt_required()
def get_years():
      return jsonify(reserve.get_year_data())

@app.route('/api/booking/add-payment', methods=['POST'])
@jwt_required()
def mark_paid():
      return jsonify(reserve.mark_paid(**request.get_json()))

@app.route('/api/booking/mark-checkin', methods=['POST'])
@jwt_required()
def mark_checkin():
      return jsonify(reserve.mark_checkin(request.args.get('id'), request.args.get('accomodation')))

@app.route('/api/booking/mark-checkout', methods=['POST'])
@jwt_required()
def mark_checkout():
      return jsonify(reserve.mark_checkout(request.args.get('id'), request.args.get('accomodation')))

@app.route('/api/booking/cancel-booking', methods=['POST'])
@jwt_required()
def cancel_booking():
      return jsonify(reserve.cancel_booking(request.args.get('id'), request.args.get('accomodation')))

@app.route('/api/booking/view-guest-details', methods=['GET'])
@jwt_required()
def view_details():
      return jsonify(reserve.view_details(request.args.get('id')))

@app.route('/get-reservation-date', methods=['GET'])
@jwt_required()
def reservation_date():
      return jsonify(reserve.get_reservation_date(request.args.get('id')))

@app.route('/api/booking/update-reservation-date', methods=['POST'])
@jwt_required()
def update_reservation_date():
      return jsonify(reserve.update_reservation_date(**request.get_json()))

@app.route('/get-data-to-update', methods=['GET'])
@jwt_required()
def get_data_to_update():
      return jsonify(reserve.get_data_to_update(request.args.get('id')))

@app.route('/api/booking/search-guest', methods=['GET'])
@jwt_required()
def search_guest():
      return jsonify(reserve.search_guest(request.args.get('name'),  request.args.get('category'), request.args.get('year'), request.args.get('month'), request.args.get('day')))


#--------------- HOUSEKEEPING ------------------#
@app.route('/api/housekeeping/metrics-data', methods=['GET'])
@jwt_required()
def housekeeping_metrics():
      return jsonify(house.housekeeping_metrics())

@app.route('/api/housekeeping/area-details', methods=['GET'])
@jwt_required()
def area_details():
      return jsonify(house.area_details(request.args.get('accomodation')))

@app.route('/api/housekeeping/status', methods=['GET'])
@jwt_required()
def housekeeping_area_status():
      return jsonify(house.housekeeping_area_status())

@app.route('/api/housekeeping/assign-cleaner', methods=['POST'])
@jwt_required()
def assign_cleaner():
      return jsonify(house.assign_cleaner(**request.get_json()))

@app.route('/api/housekeeping/update-area-condition', methods=['POST'])
@jwt_required()
def update_area_condition():
      return jsonify(house.update_room_condition(**request.get_json()))

@app.route('/api/housekeeping/staff-cleaners', methods=['GET'])
@jwt_required()
def staff_cleaners():
      return jsonify(house.staff_cleaners())

@app.route('/api/housekeeping/area-cleaning-history', methods=['GET'])
@jwt_required()
def room_cleaning_history():
      return jsonify(house.room_assigned_history(request.args.get('room_name')))

@app.route('/api/housekeeping/cleaning-history', methods=['GET'])
@jwt_required()
def cleaning_history():
      return jsonify(house.cleaning_history(request.args.get('month'), request.args.get('day')))


#--------------- RATES AND AVAILABILITY ------------------#
@app.route('/api/rates-availability/area-availability-info', methods=['GET'])
@jwt_required()
def area_availability_info():
      return jsonify(avl.availables())

@app.route('/api/rates-availability/area-availability-metrics', methods=['GET'])
@jwt_required()
def area_availability_metrics():
      return jsonify(avl.availability_metrics())

@app.route('/api/rates-availability/update-area', methods=['POST'])
@jwt_required()
def update_area():
      return jsonify(avl.update_area(**request.get_json()))

@app.route('/api/rates-availability/add-area', methods=['POST'])
@jwt_required()
def add_area():
      return jsonify(avl.add_area(**request.get_json()))

@app.route('/api/rates-availability/remove-area', methods=['DELETE'])
@jwt_required()
def remove_area():
      return jsonify(avl.remove_area(request.args.get('area_name')))


#--------------- ACCOUNTING ------------------#
@app.route('/api/accounting/accounting-metric', methods=['GET'])
@jwt_required()
def accounting_data():
      return jsonify(acc.get_current_payment_data())

@app.route('/api/accounting/accounting-data', methods=['GET'])
@jwt_required()
def load_data():
      return jsonify(acc.get_payment_data(request.args.get('year')))


#--------------- REVENUE MANAGEMENT ------------------#
@app.route('/api/revenue/add-promo', methods=['POST'])
@jwt_required()
def promo():
      return jsonify(rev.apply_promo(**request.get_json()))

@app.route('/api/revenue/update-promo', methods=['POST'])
@jwt_required()
def update_promo():
      return jsonify(rev.update_promo(**request.get_json()))

@app.route('/api/revenue/promo-data', methods=['GET'])
@jwt_required()
def get_promo():
      return jsonify(rev.get_promo_data())

@app.route('/api/revenue/remove-promo', methods=['DELETE'])
@jwt_required()
def remove_promo():
      return jsonify(rev.remove_promo(request.args.get('id'), request.args.get('area')))

@app.route('/get-promo-area-data', methods=['GET'])
@jwt_required()
def get_promo_area():
      return jsonify(rev.get_promo_area(request.args.get('id')))


#--------------- STAFF MANAGEMENT ------------------#
@app.route('/api/staff/add-staff', methods=['POST'])
@jwt_required()
def add_staff():
      return jsonify(staff.add_staff(**request.get_json()))

@app.route('/api/staff/update-staff', methods=['POST'])
@jwt_required()
def update_staff():
      return jsonify(staff.update_staff(**request.get_json()))

@app.route('/view-staff-info', methods=['GET'])
@jwt_required()
def view_staff_info():
      return jsonify(staff.view_staff_info(request.args.get('id')))

@app.route('/api/staff/remove-staff-attendance', methods=['DELETE'])
@jwt_required()
def remove_staff_attendance():
      return jsonify(staff.remove_staff_attendance(request.args.get('id'), request.args.get('status'),  request.args.get('date')))

@app.route('/api/staff/remove-staff', methods=['DELETE'])
@jwt_required()
def remove_staff():
      return jsonify(staff.remove_staff(request.args.get('id')))

@app.route('/api/staff/all-staff', methods=['GET'])
@jwt_required()
def all_staff():
      return jsonify(staff.all_staff())

@app.route('/api/staff/search-staff', methods=['GET'])
@jwt_required()
def search_staff():
      return jsonify(staff.search_staff(request.args.get('staff_name')))

@app.route('/api/staff/staff-list', methods=['GET'])
@jwt_required()
def all_staff_list():
      return jsonify(staff.staff_list(request.args.get('day'), request.args.get('month')))

@app.route('/api/staff/all-attendance', methods=['GET'])
@jwt_required()
def all_staff_attendance():
      return jsonify(staff.all_staff_attendance(request.args.get('day'), request.args.get('month')))

@app.route('/api/staff/all-present-staff', methods=['GET'])
@jwt_required()
def all_present_staff():
      return jsonify(staff.all_present_staff(request.args.get('day'), request.args.get('month')))

@app.route('/api/staff/individual-attendance-history', methods=['GET'])
@jwt_required()
def individual_staff_attendance():
      return jsonify(staff.individual_staff_attendance(request.args.get('id')))

@app.route('/api/staff/add-staff-attendance', methods=['POST'])
@jwt_required()
def add_staff_attendance():
      return jsonify(staff.add_staff_attendance(request.get_json()))

@app.route('/api/staff/update-staff-attendance', methods=['POST'])
@jwt_required()
def update_staff_attendance():
      return jsonify(staff.update_staff_attendance(request.get_json()))

@app.route('/api/staff/metrics', methods=['GET'])
@jwt_required()
def summary_cards():
      return jsonify(staff.staff_summary_cards())

@app.route('/api/staff/on-leave', methods=['GET'])
@jwt_required()
def on_leave():
      return jsonify(staff.this_week_onleave())


#--------------- ADMIN PROFILE ------------------#
@app.route('/api/profile/change-password-first-phase', methods=['POST'])
@jwt_required()
def change_pass():
      return jsonify(admin.changePass(**request.get_json()))

@app.route('/api/profile/change-password-final-phase', methods=['POST'])
@jwt_required()
def change_passv2():
      return jsonify(admin.changePassv2(request.get_json()))

@app.route('/api/profile/edit-info', methods=['POST'])
@jwt_required()
def edit_info():
      return jsonify(admin.edit_info(**request.get_json()))

@app.route('/api/profile/admin-info', methods=['GET'])
@jwt_required()
def admin_profile():
      return jsonify(admin.get_admin_profile())

@app.route('/api/profile/admin-username', methods=['GET'])
@jwt_required()
def get_admin_username():
      return jsonify(admin.admin_username())

# for retrieving booking data in db
@app.route('/get-booking-data', methods=['GET'])
def get_booking_data():
      with db.connect() as con:
            cursor = con.cursor()
            
            cursor.execute(' SELECT * FROM bookings where year(check_in) = "2025" LIMIT 200 OFFSET 200  ')
            data = cursor.fetchall()
            for d in data:
                  print(
                        "("
                        f"'{d.get('name')}', "
                        f"'{d.get('date_book')}', "
                        f"{d.get('total_guest')}, "
                        f"'{d.get('booking_type')}', "
                        f"'{d.get('payment')}', "
                        f"'{d.get('status')}', "
                        f"'{d.get('accomodations')}', "
                        f"'{d.get('check_in')}', "
                        f"'{d.get('check_out')}', "
                        f"{d.get('total_amount')}, "
                        f"'{d.get('paid_date')}', "
                        f"'{d.get('promo')}', "
                        f"'{d.get('promo_area')}'"
                        "),"
                  )

            return { 'data' : data }


# for retrieving accomodation spaces in db
@app.route('/area-get', methods=['GET'])
def areas_get ():
      try:
            with db.connect() as con:
                  cursor = con.cursor()

                  cursor.execute("SELECT * from accomodation_spaces")
                  areas = cursor.fetchall()

                  for area in areas:
                        print(f"  ('{area.get('area_name')}', {area.get('room')}, '{area.get('status')}', {area.get('rate')}, {area.get('orig_rate')}, '{area.get('promo')}', {area.get('capacity')} )")
      except Exception as e:
            con.rollback()
            return { 'success': False, 'message': f'Cancellation failed: {e}'}
      

if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0')

      