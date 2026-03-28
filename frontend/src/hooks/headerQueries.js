import { useQuery } from "@tanstack/react-query";
import { 
      getAllNotifications, 
      adminGetUsernameAPI
} from "../services/systemAPIService";

export function useNotification() {
      return useQuery({
            queryKey: ["notifications"],
            queryFn: getAllNotifications,
            keepPreviousData: true, // ← prevents flicker
            staleTime: 1000 * 30, // 30 seconds (live data)
      });
}

export function useAdminName() {
      return useQuery({
            queryKey: ["admin", "name"],
            queryFn: adminGetUsernameAPI,
            keepPreviousData: true, // ← prevents flicker
            staleTime: 1000 * 30, // 30 seconds (live data)
      });
}