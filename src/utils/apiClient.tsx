import axios from "axios";

// Fetch the access token from local storage
const getAccessToken = () => localStorage.getItem("access_token");

const apiClient = axios.create({
  baseURL: "https://apidatacapture.store/api/v1", // Updated to include /v1
  headers: {
    "Content-Type": "application/json",
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

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error("API endpoint not found:", error.config.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;