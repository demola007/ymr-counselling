import axios from "axios";

// Fetch the access token from local storage
const getAccessToken = () => localStorage.getItem("access_token");

const apiClient = axios.create({
  baseURL: "https://apidatacapture.store/api", // Removed trailing slash
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

export default apiClient;