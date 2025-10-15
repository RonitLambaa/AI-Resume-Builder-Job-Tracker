// src/features/resume/resumeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import resumeApi from "../../api/resumeApi";

// Async actions
export const fetchResumes = createAsyncThunk(
  "resumes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await resumeApi.getResumes();
      return res.data; // Assuming backend returns { data: [...resumes] }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch resumes");
    }
  }
);

export const createResume = createAsyncThunk(
  "resumes/create",
  async (resumeData, { rejectWithValue }) => {
    try {
      const res = await resumeApi.createResume(resumeData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create resume");
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  "resumes/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await resumeApi.getResume(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch resume");
    }
  }
);


export const updateResume = createAsyncThunk(
  "resumes/update",
  async ({ resumeId, data }, { rejectWithValue }) => {
    try {
      // console.log("slice ",resumeId);
      const res = await resumeApi.updateResume(resumeId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update resume");
    }
  }
);

export const deleteResume = createAsyncThunk(
  "resumes/delete",
  async (resumeId, { rejectWithValue }) => {
    try {
      await resumeApi.deleteResume(resumeId);
      return resumeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete resume");
    }
  }
);

// Slice
const resumeSlice = createSlice({
  name: "resumes",
  initialState: {
    resumes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetchResumes
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createResume
      .addCase(createResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.push(action.payload);
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchResumeById
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state) => {
        state.loading = false;
      })
      // updateResume
      .addCase(updateResume.fulfilled, (state, action) => {
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.resumes[index] = action.payload;
      })
      // deleteResume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
      });
  },
});

export default resumeSlice.reducer;
