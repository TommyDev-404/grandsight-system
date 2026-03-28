import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
      bookingsSummaryCardsAPI,
      bookingDataAPI,
      bookingSearchGuestAPI,
      bookingAreaCountsAPI,
      bookingAvlAreaName,
      bookingAddBookingAPI,
      bookingChangeShedAPI,
      bookingPaymentAPI,
      bookingCheckInAPI,
      bookingCheckOutAPI,
      bookingCancelAPI
} from "../services/systemAPIService";

// --- Query Factory (single source of truth) ---
const STALE_TIME = 1000 * 60 * 2;

export const bookingQueries = {
      summaryCards: () => ({
            queryKey: ["booking", "metric"],
            queryFn: bookingsSummaryCardsAPI,
            staleTime: STALE_TIME,
      }),

      data: ({ category, currentPage, year, month, day, nameSearch }) => ({
            queryKey: ["booking", "data", category, currentPage, year, month, day, nameSearch],
            queryFn: () => {
                  if (nameSearch && nameSearch.trim() !== "") {
                        return bookingSearchGuestAPI(nameSearch, category, currentPage, year, month, day);
                  }
                  return bookingDataAPI(category, currentPage, year, month, day);
            },
            staleTime: STALE_TIME,
      }),

      areaAvailable: (title) => ({
            queryKey: ["booking", "areaAvailable", title],
            queryFn: () => bookingAvlAreaName(title),
            staleTime: STALE_TIME,
      }),

      areaSpaces: () => ({
            queryKey: ["booking", "areaAvlSpaces"],
            queryFn: bookingAreaCountsAPI,
            staleTime: STALE_TIME,
      }),
};

// --- Mutation Factory (single source of truth) ---
export const bookingMutations = {
      addBooking: () => ({
            mutationFn: bookingAddBookingAPI,
            invalidateQueries: ["dashboard", "analytics", "rates", "accounting", "notifications", "booking"],
      }),

      changeSchedule: () => ({
            mutationFn: bookingChangeShedAPI,
            invalidateQueries: ["analytics", "notifications", "dashboard", "rates", ["booking", "metric"], ["booking", "data"]],
      }),

      addPayment: () => ({
            mutationFn: bookingPaymentAPI,
            invalidateQueries: ["analytics", "dashboard", "accounting", ["booking", "data"]],
      }),

      checkIn: () => ({
            mutationFn: ({ booking_id, accomodations }) => bookingCheckInAPI(booking_id, accomodations),
            invalidateQueries: ["analytics", "notifications", "dashboard", "rates", ["booking", "metric"], ["booking", "data"]],
      }),

      checkOut: () => ({
            mutationFn: ({ booking_id, accomodations }) => bookingCheckOutAPI(booking_id, accomodations),
            invalidateQueries: ["analytics", "dashboard", "notifications", "rates", "housekeeping", ["booking", "metric"], ["booking", "data"]],
      }),

      cancel: () => ({
            mutationFn: ({ booking_id, accomodations }) => bookingCancelAPI(booking_id, accomodations),
            invalidateQueries: ["analytics", "dashboard", "rates", "accounting", "notifications", ["booking", "metric"], ["booking", "data"]],
      }),
};

// --- Hooks (React layer) ---
export function useBookingMetric() {
      return useQuery({
            ...bookingQueries.summaryCards()
      });
}

export function useBookingData({ category, currentPage, year, month, day, nameSearch }) {
      const [debouncedSearch, setDebouncedSearch] = useState(nameSearch);

      // debounce name search to avoid too many API calls
      useEffect(() => {
            const handler = setTimeout(() => setDebouncedSearch(nameSearch), 400);
            return () => clearTimeout(handler);
      }, [nameSearch]);

      return useQuery({
            ...bookingQueries.data({ category, currentPage, year, month, day, nameSearch: debouncedSearch }),
            keepPreviousData: true,
      });
}

export function useAreaAvailable(title) {
      return useQuery({
            ...bookingQueries.areaAvailable(title),
            keepPreviousData: true,
      });
}

export function useAreaAvlSpaces() {
      return useQuery({
            ...bookingQueries.areaSpaces()
      });
}

// --- Hooks (React layer) ---
function useBookingMutation({ mutationConfig, showMessage, closeModal, clearSelection }) {
      const queryClient = useQueryClient();

      return useMutation({
            ...mutationConfig,
            onSuccess: async (res) => {
                  if (res.success) {
                        // Invalidate all queries
                        const invalidations = mutationConfig.invalidateQueries.map(q =>
                              Array.isArray(q)
                                    ? queryClient.invalidateQueries({ queryKey: q })
                                    : queryClient.invalidateQueries({ queryKey: [q] })
                        );
                        await Promise.all(invalidations);

                        // Clear local storage if addBooking
                        if (mutationConfig === bookingMutations.addBooking()) {
                              localStorage.removeItem("areaSelected");
                        }

                        if (showMessage) showMessage({ status: "success", message: res.message });
                        if (clearSelection) clearSelection();
                        if (closeModal) closeModal();
                  }
            },
            onError: () => {
                  if (showMessage) showMessage({ status: "failed", message: "Something went wrong!" });
            },
      });
}

export function useAddBooking({ showMessage, closeModal }) {
      return useBookingMutation({ mutationConfig: bookingMutations.addBooking(), showMessage, closeModal });
}

export function useChangeBookingSchedule({ showMessage, closeModal, clearSelection }) {
      return useBookingMutation({ mutationConfig: bookingMutations.changeSchedule(), showMessage, closeModal, clearSelection });
}

export function useAddPaymentMethod({ showMessage, closeModal, clearSelection }) {
      return useBookingMutation({ mutationConfig: bookingMutations.addPayment(), showMessage, closeModal, clearSelection });
}

export function useCheckinBooking({ showMessage, clearSelection }) {
      return useBookingMutation({ mutationConfig: bookingMutations.checkIn(), showMessage, clearSelection });
}

export function useCheckOutBooking({ showMessage, clearSelection }) {
      return useBookingMutation({ mutationConfig: bookingMutations.checkOut(), showMessage, clearSelection });
}

export function useCancelBooking({ showMessage, clearSelection }) {
      return useBookingMutation({ mutationConfig: bookingMutations.cancel(), showMessage, clearSelection });
}