import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
      revenueMgmtPromoDataAPI,
      revenueMgmtRemovePromoAPI,
      revenueMgmtAddPromoAPI,
      revenueMgmtUpdatePromoAPI,
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 30; // 30 seconds

export const promoQueries = {

      promoList: () => ({
            queryKey: ["promo", "data"],
            queryFn: revenueMgmtPromoDataAPI,
            staleTime: STALE_SHORT,
      }),

      resortAreas: () => ({
            queryKey: ["promo", "area"],
            queryFn: revenueMgmtPromoDataAPI,
            staleTime: STALE_SHORT,
      }),
};

export const promoMutations = {

      addPromo: () => ({
            mutationFn: revenueMgmtAddPromoAPI,

            invalidateQueries: [
                  ["booking", "data"],
                  "analytics",
                  "dashboard",
                  "rates",
                  "accounting",
                  "notifications",
            ],
      }),

      updatePromo: () => ({
            mutationFn: revenueMgmtUpdatePromoAPI,

            invalidateQueries: [
                  ["booking", "data"],
                  "analytics",
                  "dashboard",
                  "rates",
                  "accounting",
                  "promo",
            ],
      }),

      removePromo: () => ({
            mutationFn: ({ id, areas }) =>
                  revenueMgmtRemovePromoAPI({ id, areas }),

            invalidateQueries: [
                  ["booking", "data"],
                  "analytics",
                  "dashboard",
                  "rates",
                  "accounting",
                  "notifications",
            ],
      }),
};

export function usePromoList() {
      return useQuery({
            ...promoQueries.promoList(),
            keepPreviousData: true,
      });
}

export function useResortAreas() {
      return useQuery({
            ...promoQueries.resortAreas(),
            keepPreviousData: true,
      });
}

function useAppMutation(factoryFn, { showMessage, resetForm } = {}) {
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

                  queryClient.invalidateQueries('promo');
                  showMessage?.({
                        status: "success",
                        message: res.message,
                  });

                  resetForm?.();
            },

            onError: () => {
                  showMessage?.({
                        status: "failed",
                        message: "Something went wrong!",
                  });
            },
      });
}

export function useAddPromo(options) {
      return useAppMutation(
            promoMutations.addPromo,
            options
      );
}

export function useUpdatePromo(options) {
      return useAppMutation(
            promoMutations.updatePromo,
            options
      );
}

export function useRemovePromo(options) {
      return useAppMutation(
            promoMutations.removePromo,
            options
      );
}
