// src/api/resumeApi.js
import api from "./axios"; // your axios instance

const resumeApi = {
  // Create a new resume
  createResume: async (data) => {
    const response = await api.post("/resumes", data);
    return response.data;
  },

  // Get all resumes of the logged-in user
  getResumes: async () => {
    const response = await api.get("/resumes");
    return response.data;
  },

//   // Get a single resume by ID
  getResume: async (resumeId) => {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
  },

//   // Update a resume
  updateResume: async (resumeId, data) => {
    const response = await api.put(`/resumes/${resumeId}`, data);
    return response.data;
  },

//   // Delete a resume
  deleteResume: async (resumeId) => {
    console.log(resumeId);
    
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  },
};

export default resumeApi;
