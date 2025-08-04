import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItems } from "../../lib/api";
import type { Item } from "../../types/items";
import axios from "axios";

interface ItemState {
  items: Item[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchItemsAsync = createAsyncThunk(
  "items/fetchItems",
  async (_, thunkAPI) => {
    try {
      const response = await fetchItems();
      return response;
    } catch (error: unknown) {
      let message = "Unknown error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "idle";
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default itemsSlice.reducer;
