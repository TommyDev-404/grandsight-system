import { apiClient } from "./axios";


// ==================== DASHBOARD API`s ====================== //
export const dashboardLiveOperationAPI = async() => {
      const response = await apiClient.get('api/dashboard/live-operations');
      return response.data;
};

export const dashboardTodayActivityAPI = async() => {
      const response = await apiClient.get('api/dashboard/today-activity');
      return response.data;
};

export const dashboardBookingCountAPI = async() => {
      const response = await apiClient.get('api/dashboard/booking-count');
      return response.data;
};

export const upcomingBookingsAPI = async(book_type, day) => {
      const response = await apiClient.get('api/dashboard/upcoming-bookings', { params: { book_type: book_type, day: day } });
      return response.data;
};

export const bookingTrendAPI = async() => {
      const response = await apiClient.get('api/dashboard/booking-trend');
      return response.data;
};

export const bookingDistributionAPI = async() => {
      const response = await apiClient.get('api/dashboard/booking-statistics');
      return response.data;
};

// ==================== ANALYTICS API`s ====================== //
export const analyticsMetricCardAPI = async(accomodation_type) => {
      const response = await apiClient.get('api/analytics/metric-data', { params: { accomodation_type: accomodation_type ?? 'all'}});
      return response.data;
};

export const analyticsForecastAPI = async(accomodation_type) => {
      const response = await apiClient.get('api/analytics/forecast-checkin-revenue', { params: { accomodation_type: accomodation_type ?? "all"}});
      return response.data;
};

export const analyticsStatistics = async() => {
      const response = await apiClient.get('api/analytics/statistics');
      return response.data;
};

export const analyticsGetAllArea = async() => {
      const response = await apiClient.get('api/analytics/get-all-area');
      return response.data;
};

// ==================== BOOKINGS API`s ====================== //
export const bookingsSummaryCardsAPI = async() => {
      const response = await apiClient.get('api/booking/summary-cards-data');
      return response.data;
};

export const bookingUpcomingCountAPI = async() => {
      const response = await apiClient.get('api/booking/upcoming-count');
      return response.data;
};

export const bookingAddBookingAPI = async(bookingData) => {
      const response = await apiClient.post('api/booking/add-booking', bookingData);
      return response.data;
};

export const bookingCheckOutAPI = async(id, accomdation) => {
      const response = await apiClient.post('api/booking/mark-checkout', null, { params: { id: id, accomodation: accomdation }});
      return response.data;
};

export const bookingCheckInAPI = async(id, accomdation) => {
      const response = await apiClient.post('api/booking/mark-checkin', null, { params: { id: id, accomodation: accomdation }});
      return response.data;
};

export const bookingCancelAPI = async(id, accomdation) => {
      const response = await apiClient.post('api/booking/cancel-booking', null, { params: { id: id, accomodation: accomdation }});
      return response.data;
};

export const bookingChangeShedAPI = async(newSchedData) => {
      const response = await apiClient.post('api/booking/update-reservation-date', newSchedData);
      return response.data;
};

export const bookingPaymentAPI = async(newSchedData) => {
      const response = await apiClient.post('api/booking/add-payment', newSchedData);
      return response.data;
};

export const bookingDataAPI = async (category, page, year, month, day) => {
      const params = {
            category: category,
            page: Number(page),
            year: Number(year),
            month: Number(month)
      };

      // only add day if it exists
      if (day !== undefined && day !== null) {
            params.day = Number(day);
      }

      const response = await apiClient.get('api/booking/bookings-data', { params });
      return response.data;
};

export const bookingSearchGuestAPI = async (name, category, page, year, month, day) => {
      const params = {
            name: name,
            category: category,
            page: Number(page),
            year: Number(year),
            month: Number(month)
      };

      // only add day if it exists
      if (day !== undefined && day !== null) {
            params.day = Number(day);
      }

      const response = await apiClient.get('api/booking/search-guest', { params });
      return response.data;
};

export const bookingAreaCountsAPI = async() => {
      const response = await apiClient.get('api/booking/avl-spaces');
      return response.data;
};

export const bookingAvlAreaName = async(area_name) => {
      const response = await apiClient.get('api/booking/avl-area-name', { params: { area_name: area_name } });
      return response.data;
};

export const getYearsFromDBAPI = async() => {
      const response = await apiClient.get('api/booking/get-years');
      return response.data;
};

// ==================== HOUSEKEEPING API`s ====================== //
export const housekeepingSummaryDataAPI = async() => {
      const response = await apiClient.get('api/housekeeping/metrics-data');
      return response.data;
};

export const housekeepingAreaStatusAPI = async() => {
      const response = await apiClient.get('api/housekeeping/status');
      return response.data;
};

export const housekeepingAreaDetailsAPI = async(area) => {
      const response = await apiClient.get('api/housekeeping/area-details', { params: { accomodation: area } });
      return response.data;
};

export const housekeepingAreaCleaningHistoryAPI = async(roomName) => {
      const response = await apiClient.get('api/housekeeping/area-cleaning-history', { params: { room_name: roomName } });
      return response.data;
};

export const housekeepingStaffCleanersAPI = async() => {
      const response = await apiClient.get('api/housekeeping/staff-cleaners');
      return response.data;
};

export const housekeepingAssignCleanerAPI = async(cleanerData) => {
      const response = await apiClient.post('api/housekeeping/assign-cleaner', cleanerData);
      return response.data;
};

export const housekeepingMarkReadyAPI = async(roomData) => {
      const response = await apiClient.post('api/housekeeping/update-area-condition', roomData);
      return response.data;
};

export const housekeepingCleaningHistoryAPI = async(month, day) => {
      const response = await apiClient.get('api/housekeeping/cleaning-history', { params: { month: month, day: day }});
      return response.data;
};

// ==================== RATES & AVAILABILITY API`s ====================== //
export const ratesAvailabilityAreaAvailabilityInfoAPI = async() => {
      const response = await apiClient.get('api/rates-availability/area-availability-info');
      return response.data;
};

export const ratesAvailabilityAreaAvailabilityMetricAPI = async() => {
      const response = await apiClient.get('api/rates-availability/area-availability-metrics');
      return response.data;
};

export const ratesAvailabilityAddAreaAPI = async(areaData) => {
      const response = await apiClient.post('api/rates-availability/add-area', areaData);
      return response.data;
};

export const ratesAvailabilityUpdateAreaAPI = async(areaData) => {
      const response = await apiClient.post('api/rates-availability/update-area', areaData);
      return response.data;
};

export const ratesAvailabilityRemoveAreaAPI = async(areaName) => {
      const response = await apiClient.delete('api/rates-availability/remove-area', { params : { area_name: areaName } });
      return response.data;
};

// ==================== ACCOUNTING API`s ====================== //
export const accountingMetricAPI = async() => {
      const response = await apiClient.get('api/accounting/accounting-metric');
      return response.data;
};

export const accountingRevenueDataAPI = async(year) => {
      const response = await apiClient.get('api/accounting/accounting-data', { params: { year: year }});
      return response.data;
};

// ==================== REVENUE MANAGEMENT API`s ====================== //
export const revenueMgmtPromoDataAPI = async() => {
      const response = await apiClient.get('api/revenue/promo-data');
      return response.data;
};

export const revenueMgmtAddPromoAPI = async(promoData) => {
      const response = await apiClient.post('api/revenue/add-promo', promoData);
      return response.data;
};

export const revenueMgmtUpdatePromoAPI = async(promoData) => {
      console.log(promoData)
      const response = await apiClient.post('api/revenue/update-promo', promoData);
      return response.data;
};

export const revenueMgmtRemovePromoAPI = async(promoData) => {
      const response = await apiClient.delete('api/revenue/remove-promo', { params: { id: promoData.id, area: promoData.areas }});
      return response.data;
};

// ==================== STAFF MANAGEMENT API`s ====================== //
export const staffMgmtStaffMetricsAPI = async() => {
      const response = await apiClient.get('api/staff/metrics');
      return response.data;
};

export const staffMgmtAllStaffAPI = async() => {
      const response = await apiClient.get('api/staff/all-staff');
      return response.data;
};

export const staffMgmtOnLeaveStaffsAPI = async() => {
      const response = await apiClient.get('api/staff/on-leave');
      return response.data;
};

export const staffMgmtStaffAttendanceHistoryAPI = async(id) => {
      const response = await apiClient.get('api/staff/individual-attendance-history', { params: { id : id } });
      return response.data;
};

export const staffMgmtAddStaffAPI = async(formData) => {
      const response = await apiClient.post('api/staff/add-staff', formData);
      return response.data;
};

export const staffMgmtUpdateStaffAPI = async(formData) => {
      const response = await apiClient.post('api/staff/update-staff', formData);
      return response.data;
};

export const staffMgmtRemoveStaffAPI = async(id) => {
      const response = await apiClient.delete('api/staff/remove-staff', { params: { id: id } } );
      return response.data;
};

export const staffMgmtAttendanceAPI = async(day, month) => {
      const response = await apiClient.get('api/staff/all-attendance', { params: { day: day, month: month } } );
      return response.data;
};

export const staffMgmtStaffListForAddAttendanceAPI = async(day, month) => {
      const response = await apiClient.get('api/staff/staff-list', { params: { day: day, month: month } } );
      return response.data;
};

export const staffMgmtPresentStaffForTimeOutAPI = async(day, month) => {
      const response = await apiClient.get('api/staff/all-present-staff', { params: { day: day, month: month } } );
      return response.data;
};

export const staffMgmtAddStaffAttendancesAPI = async(formData) => {
      const response = await apiClient.post('api/staff/add-staff-attendance', formData);
      return response.data;
};

export const staffMgmtUpdateStaffAttendancesAPI = async(formData) => {
      const response = await apiClient.post('api/staff/update-staff-attendance', formData);
      return response.data;
};

export const staffMgmtRemoveStafAttendancefAPI = async(staffAttendanceInfo) => {
      const response = await apiClient.delete('api/staff/remove-staff-attendance', { 
            params: {
                  id: staffAttendanceInfo.id, 
                  status: staffAttendanceInfo.status, 
                  date: staffAttendanceInfo.date 
            } 
      } );
      return response.data;
};

export const staffMgmtSearchStaffAPI = async(staff_name) => {
      const response = await apiClient.get('api/staff/search-staff', { params: { staff_name: staff_name } } );
      return response.data;
};


// ==================== ADMIN PROFILE API`s ====================== //
export const adminGetInfoAPI = async() => {
      const response = await apiClient.get('api/profile/admin-info');
      return response.data;
};

export const adminChangePassFirstPhaseAPI = async(formData) => {
      const response = await apiClient.post('api/profile/change-password-first-phase', formData);
      return response.data;
};

export const adminChangePassFinalPhaseAPI = async(code) => {
      const response = await apiClient.post('api/profile/change-password-final-phase', { code: code });
      return response.data;
};

export const adminEditInfoAPI = async(modalInfo) => {
      const response = await apiClient.post('api/profile/edit-info', modalInfo);
      return response.data;
};

export const adminGetUsernameAPI = async() => {
      const response = await apiClient.get('api/profile/admin-username');
      return response.data;
};

// ==================== NOTIFICATIONS API`s ====================== //
export const getAllNotifications = async() => {
      const response = await apiClient.get('api/notification/all-notification');
      return response.data;
};
