import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
      staffMgmtStaffMetricsAPI,
      staffMgmtSearchStaffAPI,
      staffMgmtAllStaffAPI,
      staffMgmtRemoveStaffAPI,
      staffMgmtAddStaffAPI,
      staffMgmtUpdateStaffAPI,
      staffMgmtOnLeaveStaffsAPI,
      staffMgmtAttendanceAPI,
      staffMgmtStaffListForAddAttendanceAPI,
      staffMgmtAddStaffAttendancesAPI,
      staffMgmtPresentStaffForTimeOutAPI,
      staffMgmtUpdateStaffAttendancesAPI,
      staffMgmtRemoveStafAttendancefAPI,
      staffMgmtStaffAttendanceHistoryAPI
} from "../services/systemAPIService";

const STALE_SHORT = 1000 * 30;

export const staffQueries = {

      metric: () => ({
            queryKey: ["staffs", "metric"],
            queryFn: staffMgmtStaffMetricsAPI,
            staleTime: STALE_SHORT,
      }),

      onLeave: () => ({
            queryKey: ["staffs", "onLeave"],
            queryFn: staffMgmtOnLeaveStaffsAPI,
            staleTime: STALE_SHORT,
      }),

      staffList: (search = "") => ({
            queryKey: ["staffs", "list", search ?? ""],
            queryFn: () => {
                  if (search && search.trim() !== "") {
                        return staffMgmtSearchStaffAPI(search.trim());
                  }
                  return staffMgmtAllStaffAPI();
            },
            staleTime: STALE_SHORT,
      }),

      attendanceRecord: (month, day) => ({
            queryKey: ["staffs", "attendanceRecord", month, day],
            queryFn: () => staffMgmtAttendanceAPI(day, month),
            staleTime: STALE_SHORT,
      }),

      attendanceHistory: () => ({
            queryKey: ["staffs", "attendanceHistory"],
            queryFn: () => staffMgmtStaffAttendanceHistoryAPI(),
            staleTime: STALE_SHORT,
      }),

      notRecorded: (month, day) => ({
            queryKey: ["staffs", "notRecorded", month, day],
            queryFn: () =>
                  staffMgmtStaffListForAddAttendanceAPI(day, month),
            staleTime: STALE_SHORT,
      }),

      notTimeOuted: (month, day) => ({
            queryKey: ["staffs", "notTimeOuted", month, day],
            queryFn: () =>
                  staffMgmtPresentStaffForTimeOutAPI(day, month),
            staleTime: STALE_SHORT,
      }),
};

export const staffMutations = {

      addStaff: () => ({
            mutationFn: staffMgmtAddStaffAPI,
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"],
            ],
      }),

      updateStaff: () => ({
            mutationFn: staffMgmtUpdateStaffAPI,
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"]
            ],
      }),

      removeStaff: () => ({
            mutationFn: (id) => staffMgmtRemoveStaffAPI(id),
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"],
            ],
      }),

      addAttendance: () => ({
            mutationFn: staffMgmtAddStaffAttendancesAPI,
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"],
            ],
      }),

      updateAttendance: () => ({
            mutationFn: staffMgmtUpdateStaffAttendancesAPI,
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"],
            ],
      }),

      removeAttendance: () => ({
            mutationFn: staffMgmtRemoveStafAttendancefAPI,
            invalidateQueries: [
                  ["housekeeping", "staffCleaners"],
            ],
      }),
};

export function useStaffsMetric() {
      return useQuery({
            ...staffQueries.metric(),
            keepPreviousData: true,
      });
}

export function useStaffOnLeave() {
      return useQuery({
            ...staffQueries.onLeave(),
            keepPreviousData: true,
      });
}

export function useStaffAttendanceHistory() {
      return useQuery({
            ...staffQueries.attendanceHistory(),
            keepPreviousData: true,
      });
}

export function useStaffList(search) {
      return useQuery({
            ...staffQueries.staffList(search),
            keepPreviousData: true,
      });
}

export function useStaffAttendanceRecord(month, day) {
      return useQuery({
            ...staffQueries.attendanceRecord(month, day),
            keepPreviousData: true,
      });
}

export function useStaffsNotRecorded(month, day) {
      return useQuery({
            ...staffQueries.notRecorded(month, day),
            keepPreviousData: true,
      });
}

export function useStaffsNotTimeOuted(month, day) {
      return useQuery({
            ...staffQueries.notTimeOuted(month, day),
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

                  queryClient.invalidateQueries("staffs");
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

export const useAddStaff = (options) =>
      useAppMutation(staffMutations.addStaff, options);

export const useUpdateStaff = (options) =>
      useAppMutation(staffMutations.updateStaff, options);

export const useRemoveStaff = (options) =>
      useAppMutation(staffMutations.removeStaff, options);

export const useAddStaffAttendance = (options) =>
      useAppMutation(staffMutations.addAttendance, options);

export const useUpdateStaffAttendance = (options) =>
      useAppMutation(staffMutations.updateAttendance, options);

export const useRemoveStaffAttendance = (options) =>
      useAppMutation(staffMutations.removeAttendance, options);
