import { useMutation } from "@tanstack/react-query";
import { 
      loginAPI,
      forgotPasswordAPI,
      verifyCodeAPI,
      changePasswordAPI
} from "../services/authService.js";


export function useLogin({ showMessage }) {
      return useMutation({
            mutationFn: ({ username, password }) => loginAPI({ username, password }),
            onSuccess:  async (res) => {
                  if (res.data.success) {
                        localStorage.setItem("access_token", res.data.access_token);
                  } else {
                        showMessage({ status: "error", message: res.data.message });
                  }
            },
      });
}

export function useEmailVerification({ showMessage, setStep }) {
      return useMutation({
            mutationFn: ( email ) => forgotPasswordAPI(email),
            onSuccess:  async (res) => {
                  if (res.success) {
                        showMessage({ status: "success", message: res.message });
                        setStep('code');
                  } else {
                        showMessage({ status: "error", message: res.message });
                  }
            },
      });
}

export function useCodeVerification({ showMessage, switchView }) {
      return useMutation({
            mutationFn: ( code ) => verifyCodeAPI(code),
            onSuccess:  async (res) => {
                  if (res.success) {
                        await new Promise((resolve) => setTimeout(resolve, 1500)); // delay
                        switchView("update password");
                  } else {
                        showMessage({ status: "error", message: res.message });
                  }
            },
      });
}

export function useChangePassword({ showMessage, switchView }) {
      return useMutation({
            mutationFn: ( newPassword ) => changePasswordAPI(newPassword),
            onSuccess:  async (res) => {
                  if (res.success) {
                        await new Promise((resolve) => setTimeout(resolve, 1500)); // delay
                        showMessage({ status: "success", message: res.message });
                        switchView("login");
                  } else {
                        showMessage({ status: "error", message: res.message });
                  }
            },
      });
}