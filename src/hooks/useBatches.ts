import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BatchApi } from "../api/batchApi";
import { Batch } from "../types/batch";
import { ApiResponseMessage } from "../types/common";

interface BatchesState {
  batches: Batch[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BatchesState = {
  batches: [],
  status: "idle",
  error: null,
};

// Async thunk để fetch batch
export const fetchBatches = createAsyncThunk<
  Batch[],
  void,
  { rejectValue: string }
>("batches/fetchBatches", async (_, { rejectWithValue }) => {
  try {
    const data = await BatchApi.getBatchesByFarm(); // data thẳng từ axios
    console.log("Fetch batches response:", data);
    return data as Batch[];
  } catch (err: any) {
    console.error("Error fetching batches:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateAverageWeight = createAsyncThunk<
  Batch,
  { assetID: string; averageWeightData: any },
  { rejectValue: string }
>(
  "batches/updateAverageWeight",
  async ({ assetID, averageWeightData }, { rejectWithValue }) => {
    try {
      const data = await BatchApi.updateAverageWeight(
        assetID,
        averageWeightData
      );
      console.log("Update average weight response:", data);
      const updatedBatch = data as ApiResponseMessage;
      if (updatedBatch.status !== "success") {
        return rejectWithValue(
          updatedBatch.message || "Failed to update average weight"
        );
      }
      const newBatch = await BatchApi.getBatchAtFarm(assetID);
      return newBatch as Batch;
    } catch (err: any) {
      console.error(
        "Error updating average weight:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateExpectedHarvestDate = createAsyncThunk<
  Batch,
  { assetID: string; expectedHarvestDate: string },
  { rejectValue: string }
>(
  "batches/updateExpectedHarvestDate",
  async ({ assetID, expectedHarvestDate }, { rejectWithValue }) => {
    try {
      const data = await BatchApi.updateExpectedHarvestDate(
        assetID,
        expectedHarvestDate
      );
      console.log("Update expected harvest date response:", data);
      const updatedBatch = data as ApiResponseMessage;
      if (updatedBatch.status !== "success") {
        return rejectWithValue(
          updatedBatch.message || "Failed to update expected harvest date"
        );
      }
      const newBatch = await BatchApi.getBatchAtFarm(assetID);
      return newBatch as Batch;
    } catch (err: any) {
      console.error(
        "Error updating expected harvest date:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addFeed = createAsyncThunk<
  Batch,
  { assetID: string; feedData: any },
  { rejectValue: string }
>("batches/addFeed", async ({ assetID, feedData }, { rejectWithValue }) => {
  try {
    const data = await BatchApi.addFeed(assetID, feedData);
    console.log("Add feed response:", data);
    const updatedBatch = data as ApiResponseMessage;
    if (updatedBatch.status !== "success") {
      return rejectWithValue(updatedBatch.message || "Failed to add feed");
    }
    const newBatch = await BatchApi.getBatchAtFarm(assetID);
    return newBatch as Batch;
  } catch (err: any) {
    console.error("Error adding feed:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addMedication = createAsyncThunk<
  Batch,
  { assetID: string; medicationData: any },
  { rejectValue: string }
>(
  "batches/addMedication",
  async ({ assetID, medicationData }, { rejectWithValue }) => {
    try {
      const data = await BatchApi.addMedication(assetID, medicationData);
      console.log("Add medication response:", data);
      const updatedBatch = data as ApiResponseMessage;
      if (updatedBatch.status !== "success") {
        return rejectWithValue(
          updatedBatch.message || "Failed to add medication"
        );
      }
      const newBatch = await BatchApi.getBatchAtFarm(assetID);
      return newBatch as Batch;
    } catch (err: any) {
      console.error(
        "Error adding medication:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addCertificate = createAsyncThunk<
  Batch,
  { assetID: string; certificateData: any },
  { rejectValue: string }
>(
  "batches/addCertificate",
  async ({ assetID, certificateData }, { rejectWithValue }) => {
    try {
      const data = await BatchApi.addCertificate(assetID, certificateData);
      console.log("Add certificate response:", data);
      const updatedBatch = data as ApiResponseMessage;
      if (updatedBatch.status !== "success") {
        return rejectWithValue(
          updatedBatch.message || "Failed to add certificate"
        );
      }
      const newBatch = await BatchApi.getBatchAtFarm(assetID);
      return newBatch as Batch;
    } catch (err: any) {
      console.error(
        "Error adding certificate:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const batchesSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchBatches.fulfilled,
        (state, action: PayloadAction<Batch[]>) => {
          state.status = "succeeded";
          state.batches = action.payload;
        }
      )
      .addCase(fetchBatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch batches";
      })
      .addCase(updateAverageWeight.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateAverageWeight.fulfilled,
        (state, action: PayloadAction<Batch>) => {
          state.status = "succeeded";
          const index = state.batches.findIndex(
            (batch) => batch.assetID === action.payload.assetID
          );
          if (index !== -1) {
            state.batches[index] = action.payload;
          }
        }
      )
      .addCase(updateAverageWeight.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update average weight";
      })
      .addCase(updateExpectedHarvestDate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateExpectedHarvestDate.fulfilled,
        (state, action: PayloadAction<Batch>) => {
          state.status = "succeeded";
          const index = state.batches.findIndex(
            (batch) => batch.assetID === action.payload.assetID
          );
          if (index !== -1) {
            state.batches[index] = action.payload;
          }
        }
      )
      .addCase(updateExpectedHarvestDate.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Failed to update expected harvest date";
      })
      .addCase(addFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addFeed.fulfilled, (state, action: PayloadAction<Batch>) => {
        state.status = "succeeded";
        const index = state.batches.findIndex(
          (batch) => batch.assetID === action.payload.assetID
        );
        if (index !== -1) {
          state.batches[index] = action.payload;
        }
      })
      .addCase(addFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add feed";
      })
      .addCase(addMedication.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addMedication.fulfilled,
        (state, action: PayloadAction<Batch>) => {
          state.status = "succeeded";
          const index = state.batches.findIndex(
            (batch) => batch.assetID === action.payload.assetID
          );
          if (index !== -1) {
            state.batches[index] = action.payload;
          }
        }
      )
      .addCase(addMedication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add medication";
      })
      .addCase(addCertificate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addCertificate.fulfilled,
        (state, action: PayloadAction<Batch>) => {
          state.status = "succeeded";
          const index = state.batches.findIndex(
            (batch) => batch.assetID === action.payload.assetID
          );
          if (index !== -1) {
            state.batches[index] = action.payload;
          }
        }
      )
      .addCase(addCertificate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add certificate";
      });
  },
});

export const {} = batchesSlice.actions;
export default batchesSlice.reducer;
