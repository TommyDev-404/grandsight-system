import axios from "axios";

export const apiClient = axios.create({
      baseURL: "http://localhost:5000/",
      headers: {
            "Content-Type": "application/json",
      },
      withCredentials: true
});


// Request interceptor
apiClient.interceptors.request.use(
      (config) => {     
            const token = localStorage.getItem("access_token");
            if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      },
      (error) => {
            return Promise.reject(error);
      }
);

// Response interceptor
apiClient.interceptors.response.use(
      (response) => response, // just return response if all is good
      (error) => {
            // Example: handle 401 Unauthorized globally
            if (error.response && error.response.status === 401) {
                  window.location.href = '/not-authorized';
            }
            return Promise.reject(error);
      }
);    
