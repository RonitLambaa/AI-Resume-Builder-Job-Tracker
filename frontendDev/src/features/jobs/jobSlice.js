import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobApi from "../../api/jobApi";

// Fetch all jobs
export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await jobApi.getJobs();
    return res.data?.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
  }
});

// Add a job
export const addJob = createAsyncThunk("jobs/add", async (job, { rejectWithValue }) => {
  try {
    const res = await jobApi.addJob(job);   
    return res.data?.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add job");
  }
});

// Update job
export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ jobId, data }, { rejectWithValue }) => {
    try {
      const res = await jobApi.updateJob(jobId, data);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job");
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk("jobs/delete", async (jobId, { rejectWithValue }) => {
  try {
    await jobApi.deleteJob(jobId);
    return jobId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete job");
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add job
    builder
      .addCase(addJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update job
    builder
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job
        );
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
