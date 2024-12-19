import axios from "axios";

// Fetch the access token from local storage
const getAccessToken = () => localStorage.getItem("access_token");

const apiClient = axios.create({
  baseURL: "http://13.61.24.195", // Centralized base URL
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

// Add an interceptor to automatically include the token in request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;