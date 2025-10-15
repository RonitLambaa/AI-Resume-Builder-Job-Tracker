import api from "./axios";

const authApi = {
  login: (data) => api.post("auth/login", data),
  signup: (data) => api.post("auth/register", data),
  logout: () => api.post("auth/logout"),
  refreshToken: (token) => api.post("auth/refresh", { token }),
};

export default authApi;
