-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS resort_db;
SET GLOBAL time_zone = '+08:00'; -- crucial part 

USE resort_db;

-- bookings table
CREATE TABLE bookings (
      booking_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      date_book  DATE NULL,
      total_guest INT(11) NOT NULL,
      booking_type ENUM('Check-in', 'Day Guest')NOT NULL,
      payment ENUM(
            'Direct Payment',
            'ZUZU (Online Payment)',
            'Refunded',
            'Pending',
            'None'
      ) NOT NULL,
      status ENUM(
            'Reserved',
            'Checked-in',
            'Checked-out',
            'Cancelled'
      ) DEFAULT 'Reserved',
      accomodations VARCHAR(255)
            COLLATE utf8mb4_bin
            DEFAULT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      paid_date DATE NULL,
      promo VARCHAR(255)  NULL,
      promo_area VARCHAR(255)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- area_revenue
CREATE TABLE area_revenue (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      booking_id INT(11) NOT NULL,
      area VARCHAR(255)  NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      amount INT(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- accomodation_spaces table
CREATE TABLE accomodation_spaces (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      area_name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      room INT(11) NOT NULL,
      status VARCHAR(50) NOT NULL,
      rate INT(100) NOT NULL,
      orig_rate INT(100) NOT NULL,
      promo VARCHAR(100) DEFAULT NULL,
      capacity INT(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- promos
CREATE TABLE promos (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      discount INT(11) NOT NULL,
      area VARCHAR(255) NOT NULL,
      status ENUM('Active', 'Expired', 'Upcoming') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- admin table
CREATE TABLE admin (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      contact VARCHAR(11) NOT NULL,
      code INT(6) NOT NULL,
      hash_pass VARCHAR(255) NOT NULL,
      date_pass_change DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- notifications
CREATE TABLE notifications (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NULL,
      date TIMESTAMP  NULL,
      room_name VARCHAR(20)   NULL,
      room_no VARCHAR(3)  NULL,
      alert_type VARCHAR(50)  NULL,
      classification VARCHAR(50) NULL,
      counts int(50) NULL,
      guests int(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- staff attendance table
CREATE TABLE staff_attendance (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      staff_id INT(11) NOT NULL,
      name VARCHAR(100) NOT NULL,
      time_in VARCHAR(20) NOT NULL,
      time_out VARCHAR(20) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status ENUM('Present (Whole Day)', 'Present (Half Day)', 'Absent', '--', 'Present (Overtime)') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- staff details
CREATE TABLE staff_details (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      staff_name VARCHAR(100) NOT NULL,
      date_started DATE NOT NULL,
      daily_salary INT(100) NOT NULL,
      weekly_salary INT(11) NOT NULL,
      monthly_salary INT(11) NOT NULL,
      estimate_weekly INT(100) NOT NULL,
      estimate_month INT(100) NOT NULL,
      job_position VARCHAR(100) NOT NULL,
      avl_leave INT(11) NOT NULL,
      status ENUM('On Leave', 'Active', 'Absent') NOT NULL,
      workdays DOUBLE NOT NULL,
      absent INT(11) NOT NULL,
      reset_date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- staff_leaves_data 
CREATE TABLE staff_leaves_data (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      staff_id INT(11) NOT NULL,
      name VARCHAR(100) NOT NULL,
      job_position VARCHAR(50) NOT NULL,
      date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- room staff assigned history
CREATE TABLE room_assign_history (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      room VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
