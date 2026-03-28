import { useQuery } from "@tanstack/react-query";
import { 
      accountingMetricAPI,
      accountingRevenueDataAPI
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 30; // 30 seconds

export const accountingQueries = {

      metric: () => ({
            queryKey: ["accounting", "metric"],
            queryFn: accountingMetricAPI,
            staleTime: STALE_SHORT,
      }),

      revenueData: (year) => ({
            queryKey: ["accounting", "revenueData", year],
            queryFn: () => accountingRevenueDataAPI(year),
            staleTime: STALE_SHORT,
      }),
};

export function useAccountingMetric() {
      return useQuery({
            ...accountingQueries.metric(),
            keepPreviousData: true
      });
}

export function useRevenueData(year) {
      return useQuery({
            ...accountingQueries.revenueData(year),
            keepPreviousData: true,
      });
}