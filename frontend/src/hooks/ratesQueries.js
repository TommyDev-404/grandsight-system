import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
      ratesAvailabilityAreaAvailabilityMetricAPI,
      ratesAvailabilityAreaAvailabilityInfoAPI,
      ratesAvailabilityRemoveAreaAPI,
      ratesAvailabilityAddAreaAPI,
      ratesAvailabilityUpdateAreaAPI
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 30; // 30 seconds

export const ratesAvailabilityQueries = {

      metric: () => ({
            queryKey: ["rates", "availabilityMetric"],
            queryFn: ratesAvailabilityAreaAvailabilityMetricAPI,
            staleTime: STALE_SHORT,
      }),

      areaInfo: () => ({
            queryKey: ["rates", "areaAvailabilityInfo"],
            queryFn: ratesAvailabilityAreaAvailabilityInfoAPI,
            staleTime: STALE_SHORT,
      }),
};

export const ratesAvailabilityMutations = {

      removeArea: () => ({
            mutationFn: (areaName) =>
                  ratesAvailabilityRemoveAreaAPI(areaName),

            invalidateQueries: [
                  "rates",
                  "dashboard",
                  ["booking", "areaAvailable"],
                  ["booking", "areaAvlSpaces"],
                  "analytics",
                  ["housekeeping"],
            ],
      }),

      addArea: () => ({
            mutationFn: ratesAvailabilityAddAreaAPI,

            invalidateQueries: [
                  "rates",
                  "dashboard",
                  ["booking", "areaAvailable"],
                  ["booking", "areaAvlSpaces"],
                  "analytics",
                  ["housekeeping"],
            ],
      }),

      updateArea: () => ({
            mutationFn: ratesAvailabilityUpdateAreaAPI,
            invalidateQueries: [
                  "rates",
                  "dashboard",
                  ["booking", "data"],
                  ["booking", "areaAvailable"],
                  ["booking", "areaAvlSpaces"],
                  "analytics",
                  "promo",
                  ["housekeeping"],
            ],
      }),
};

export function useRatesAvailabilityMetric() {
      return useQuery({
            ...ratesAvailabilityQueries.metric(),
      });
}

export function useAreaRatesAvailabilityInfo() {
      return useQuery({
            ...ratesAvailabilityQueries.areaInfo(),
            keepPreviousData: true,
      });
}

function useAppMutation(factoryFn, { showMessage, closeModal } = {}) {
      const queryClient = useQueryClient();
      const config = factoryFn();

      return useMutation({
            mutationFn: config.mutationFn,

            onSuccess: async (res) => {
                  if (!res?.success) return;

                  if (config.invalidateQueries?.length) {
                        await Promise.all(
                              config.invalidateQueries.map((key) =>
                                    queryClient.invalidateQueries({
                                          queryKey: Array.isArray(key) ? key : [key],
                                    })
                              )
                        );
                  }

                  showMessage?.({
                        status: "success",
                        message: res.message,
                  });

                  closeModal?.();
            },

            onError: () => {
                  showMessage?.({
                        status: "failed",
                        message: "Something went wrong!",
                  });
            },
      });
}

export function useRemoveArea(options) {
      return useAppMutation(
            ratesAvailabilityMutations.removeArea,
            options
      );
}

export function useAddArea(options) {
      
      return useAppMutation(
            ratesAvailabilityMutations.addArea,
            options
      );
}

export function useUpdateArea(options) {
      return useAppMutation(
            ratesAvailabilityMutations.updateArea,
            options
      );
}