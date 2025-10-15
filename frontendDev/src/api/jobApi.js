import api from "./axios";


const jobApi = {
  getJobs: () => api.get("/jobs"),
  addJob: (data) => api.post("/jobs", data),
  updateJob: (jobId, data) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

export default jobApi;
