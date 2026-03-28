import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
      housekeepingSummaryDataAPI,
      housekeepingAreaStatusAPI,
      housekeepingAreaDetailsAPI,
      housekeepingAreaCleaningHistoryAPI,
      housekeepingStaffCleanersAPI,
      housekeepingCleaningHistoryAPI
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 60 * 2;     // 30 seconds (live data)
const STALE_LONG  = 1000 * 60 * 5; // 5 minutes (history type data)


// --- Housekeeping Query Factory ---
export const housekeepingQueries = {

      metric: () => ({
            queryKey: ["housekeeping", "metric"],
            queryFn: housekeepingSummaryDataAPI,
            staleTime: STALE_SHORT,
      }),

      areaStatus: () => ({
            queryKey: ["housekeeping", "areaStatus"],
            queryFn: housekeepingAreaStatusAPI,
            staleTime: STALE_SHORT,
      }),

      areaDetails: (areaName) => ({
            queryKey: ["housekeeping", "areaDetails", areaName],
            queryFn: () => housekeepingAreaDetailsAPI(areaName),
            staleTime: STALE_SHORT,
      }),

      areaIndividualCleaning: (areaName) => ({
            queryKey: ["housekeeping", "areaIndividualCleaning", areaName],
            queryFn: () => housekeepingAreaCleaningHistoryAPI(areaName),
            staleTime: STALE_LONG,
      }),

      cleaningHistory: (month, day) => ({
            queryKey: ["housekeeping", "cleaningHistory", month, day],
            queryFn: () => housekeepingCleaningHistoryAPI(month, day),
            staleTime: STALE_LONG,
      }),

      staffCleaners: () => ({
            queryKey: ["housekeeping", "staffCleaners"],
            queryFn: housekeepingStaffCleanersAPI,
            staleTime: STALE_SHORT,
      }),
};

// --- Mutation Factory (single source of truth) ---
export const housekeepingMutations = {

      addCleaner: () => ({
            mutationFn: housekeepingAssignCleanerAPI,
            invalidateQueries: [
                  "notifications",
                  "dashboard",
                  ["booking", "areaAvailable"],
                  ["booking", "areaAvlSpaces"],
            ],
      }),

      markReady: () => ({
            mutationFn: ({ room_no, area_name }) =>
                  housekeepingMarkReadyAPI({ room_no, area_name }),

            invalidateQueries: [
                  "notifications",
                  "dashboard",
                  "rates",
                  ["booking", "areaAvailable"],
                  ["booking", "areaAvlSpaces"],
            ],
      }),
};

// --- React Hooks Layer ---
export function useHousekeepingMetric() {
      return useQuery({
            ...housekeepingQueries.metric(),
      });
}

export function useAreaStatus() {
      return useQuery({
            ...housekeepingQueries.areaStatus(),
      });
}

export function useAreaDetails(areaName) {
      return useQuery({
            ...housekeepingQueries.areaDetails(areaName),
            keepPreviousData: true,
      });
}

export function useAreaIndividualCleaning(areaName) {
      return useQuery({
            ...housekeepingQueries.areaIndividualCleaning(areaName),
            keepPreviousData: true, 
      });
}

export function useCleaningHistory(month, day) {
      return useQuery({
            ...housekeepingQueries.cleaningHistory(month, day),
            keepPreviousData: true, 
      });
}

export function useStaffCleaners() {
      return useQuery({
            ...housekeepingQueries.staffCleaners()
      });
}


// --- Mutations Part ---
function useAppMutation(factoryFn, { showMessage, handleCloseModal } = {}) {
      const queryClient = useQueryClient();
      const config = factoryFn();

      return useMutation({
            mutationFn: config.mutationFn,

            onSuccess: async (res) => {
                  if (!res?.success) return;

                  // Invalidate all relevant queries
                  if (config.invalidateQueries?.length) {
                        await Promise.all(
                              config.invalidateQueries.map((key) =>
                                    queryClient.invalidateQueries({
                                          queryKey: Array.isArray(key) ? key : [key],
                                    })
                              )
                        );
                  }
                  
                  queryClient.invalidateQueries("housekeeping");
                  // Show success message if available
                  showMessage?.({ status: "success", message: res.message });
                  handleCloseModal?.();
            },

            onError: () => {
                  showMessage?.({
                        status: "failed",
                        message: "Something went wrong!",
                  });
            },
      });
}

export function useAddCleaner(options) {
      return useAppMutation(housekeepingMutations.addCleaner, options);
}

export function useMarkReady(options) {
      return useAppMutation(housekeepingMutations.markReady, options);
}