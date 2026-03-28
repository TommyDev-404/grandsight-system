import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
      analyticsMetricCardAPI,
      analyticsStatistics,
      analyticsForecastAPI,
      analyticsGetAllArea
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 60 * 2;   // 30 seconds
const STALE_LONG  = 1000 * 60 * 5; // 5 minutes

// --- Analytics Query Factory ---
export const analyticsQueries = {
      metric: (area) => ({
            queryKey: ["analytics", "metric", area],
            queryFn: () => analyticsMetricCardAPI(area),
            staleTime: STALE_SHORT
      }),

      forecast: (area) => ({
            queryKey: ["analytics", "forecast", area],
            queryFn: () => analyticsForecastAPI(area),
            staleTime: STALE_LONG,
      }),

      statistics: () => ({
            queryKey: ["analytics", "statistics"],
            queryFn: analyticsStatistics,
            staleTime: STALE_LONG,
      }),

      allResortArea: () => ({
            queryKey: ["analytics", "allResortArea"],
            queryFn: analyticsGetAllArea,
            staleTime: STALE_SHORT,
      }),
};

// --- React Hooks ---
export function useAnalyticMetric(area) {
      return useQuery({
            ...analyticsQueries.metric(area),
            keepPreviousData: true, 
      });
}

export function useAnalyticForecast(area) {
      return useQuery({
            ...analyticsQueries.forecast(area),
            keepPreviousData: true, 
      });
}

export function useAnalyticStatistics() {
      return useQuery({
            ...analyticsQueries.statistics()
      });
}

export function useGetAllResortArea() {
      return useQuery({
            ...analyticsQueries.allResortArea()
      });
}