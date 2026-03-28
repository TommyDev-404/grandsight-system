import { apiClient } from "./axios";

export const loginAPI = async (user) => {
      const response = await apiClient.post("api/login", user);
      return response;
};

export const logoutAPI = async() => {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
}

export const forgotPasswordAPI = async(email) => {
      const response = await apiClient.post('api/forgot-password', { email: email });
      return response.data;
};

export const verifyCodeAPI = async(code) => {
      const response = await apiClient.post('api/forgot-password/code-verification', { code: code });
      return response.data;
};

export const changePasswordAPI = async(new_password) => {
      const response = await apiClient.post('api/change-password', { new_password: new_password });
      return response.data;
};