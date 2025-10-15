import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice"
import jobReducer from "../features/jobs/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resumes : resumeReducer,
    jobs: jobReducer
  },
});

export default store;
