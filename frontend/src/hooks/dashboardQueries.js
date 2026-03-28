import { useQuery } from "@tanstack/react-query";
import {
      dashboardBookingCountAPI,
      dashboardLiveOperationAPI,
      dashboardTodayActivityAPI,
      upcomingBookingsAPI,
      ratesAvailabilityAreaAvailabilityInfoAPI,
      ratesAvailabilityAreaAvailabilityMetricAPI,
      bookingTrendAPI,
      bookingDistributionAPI,
} from "../services/systemAPIService";

// --- Query Factory (single source of truth) ---
const STALE_TIME = 1000 * 60 * 2;

export const dashboardQueries = {
      liveOperation: () => ({
            queryKey: ["dashboard", "liveOperation"],
            queryFn: dashboardLiveOperationAPI,
            staleTime: STALE_TIME,
      }),

      todayActivity: () => ({
            queryKey: ["dashboard", "todayActivity"],
            queryFn: dashboardTodayActivityAPI,
            staleTime: STALE_TIME,
      }),

      bookingCount: () => ({
            queryKey: ["dashboard", "bookingCount"],
            queryFn: () => dashboardBookingCountAPI(),
            staleTime: STALE_TIME,
      }),

      upcomingBooking: (type, day) => ({
            queryKey: ["dashboard", "upcomingBooking", type, day],
            queryFn: () => upcomingBookingsAPI(type, day),
            staleTime: STALE_TIME,
      }),

      roomOverviewMetric: () => ({
            queryKey: ["dashboard", "roomOverviewMetric"],
            queryFn: ratesAvailabilityAreaAvailabilityMetricAPI,
            staleTime: STALE_TIME,
      }),

      roomOverviewAreas: () => ({
            queryKey: ["dashboard", "roomOverviewAreas"],
            queryFn: ratesAvailabilityAreaAvailabilityInfoAPI,
            staleTime: STALE_TIME,
      }),

      bookingTrend: () => ({
            queryKey: ["dashboard", "bookingTrend"],
            queryFn: bookingTrendAPI,
            staleTime: STALE_TIME,
      }),

      bookingStats: () => ({
            queryKey: ["dashboard", "bookingStats"],
            queryFn: bookingDistributionAPI,
            staleTime: STALE_TIME,
      }),
};

// --- Hooks (React layer) ---
export function useLiveOperational() {
      return useQuery({
            ...dashboardQueries.liveOperation()
      });
}

export function useTodayActivity() {
      return useQuery({
            ...dashboardQueries.todayActivity()
      });
}

export function useBookingCount() {
      return useQuery({
            ...dashboardQueries.bookingCount()
      });
}

export function useUpcomingBooking(type, day) {
      return useQuery({
            ...dashboardQueries.upcomingBooking(type, day),
            keepPreviousData: true,
      });
}

export function useRoomOverviewMetric() {
      return useQuery({
            ...dashboardQueries.roomOverviewMetric()
      });
}

export function useRoomOverviewAreas() {
      return useQuery({
            ...dashboardQueries.roomOverviewAreas()
      });
}

export function useBookingTrend() {
      return useQuery({
            ...dashboardQueries.bookingTrend()
      });
}

export function useBookingStats() {
      return useQuery({
            ...dashboardQueries.bookingStats()
      });
}