import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BatchApi } from "../api/batchApi";

export interface Quantity {
  value: number;
  unit: string;
}

export interface BatchHistoryDetails {
  address: {
    fullText: string;
    latitude: number;
    longitude: number;
  };
  certificates: { mimeType: string; s3Bucket: string; s3Key: string }[];
  expectedHarvestDate: string;
  feed: string[];
  medications: string[];
  startDate: string;
  facilityID: string;
  facilityName: string;
  harvestDate: string;
}

export interface BatchHistory {
  type: string;
  actorMSP: string;
  actorID: string;
  timestamp: string;
  txID: string;
  details: BatchHistoryDetails;
}

export interface Batch {
  assetID: string;
  productName: string;
  originalQuantity: Quantity;
  currentQuantity: Quantity;
  history: BatchHistory[];
  status: string;
}

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
      });
  },
});

export const {} = batchesSlice.actions;
export default batchesSlice.reducer;
