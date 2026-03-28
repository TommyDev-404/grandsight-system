import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
      adminGetInfoAPI,
      adminEditInfoAPI,
      adminChangePassFirstPhaseAPI,
      adminChangePassFinalPhaseAPI
} from "../services/systemAPIService";


export function useAdminProfileInfo() {
      return useQuery({
            queryKey: ["admin", "profile"],
            queryFn: adminGetInfoAPI,
            staleTime: 1000 * 30, // 30 seconds (live data)
            keepPreviousData: true, // ← prevents flicker
      });
}

// Mutations or PPOST Method
export function useUpdateAdminProfile({ showMessage, closeModal }) {
      const queryClient = useQueryClient();

      return useMutation({
            mutationFn: ({ info, modalType, id }) => adminEditInfoAPI({ info, modalType, id }),
            onSuccess: async (res) => {
                  if (res.success) {
                        await Promise.all([
                              queryClient.invalidateQueries({ queryKey: ["admin"] }),
                        ]);                       
                  
                        showMessage({ status: "success", message: res.message });
                        closeModal();
                  }
            }
      });
}

export function useUpdateAdminPassword({ showMessage, closeModal, openModal }) {
      const queryClient = useQueryClient();

      return useMutation({
            mutationFn: adminChangePassFirstPhaseAPI,
            onSuccess: async (res) => {
                  if (res.success) {
                        await Promise.all([
                              queryClient.invalidateQueries({ queryKey: ["admin"] }),
                        ]);                       
                  
                        showMessage({ status: "success", message: res.message });
                        closeModal();
                        openModal({ name : 'input code' });
                  }
            }
      });
}

export function useVerifyCodeForPasswordUpdating({ showMessage, closeModal }) {
      const queryClient = useQueryClient();

      return useMutation({
            mutationFn: (code)=> adminChangePassFinalPhaseAPI(code),
            onSuccess: async (res) => {
                  if (res.success) {
                        await Promise.all([
                              queryClient.invalidateQueries({ queryKey: ["admin"] }),
                        ]);                       
                  
                        showMessage({ status: "success", message: res.message });
                        closeModal();
                  }
            }
      });
}