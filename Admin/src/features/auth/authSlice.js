import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";
import { toast } from "react-toastify";

// Get user from localStorage
const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// Initial state
const initialState = {
  user: getUserfromLocalStorage,
  orders: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "", // Ensure this is always a string
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching orders
export const getOrders = createAsyncThunk(
  "order/get-orders",
  async (data, thunkAPI) => {
    try {
      return await authService.getOrders(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching a single order
export const getaOrder = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      return await authService.getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for updating an order
export const updateAOrder = createAsyncThunk(
  "order/update-order",
  async (data, thunkAPI) => {
    try {
      return await authService.updateOrder(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching monthly data
export const getMonthlyData = createAsyncThunk(
  "orders/monthlydata",
  async (data, thunkAPI) => {
    try {
      return await authService.getMonthlyOrders(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for fetching yearly data
export const getYearlyData = createAsyncThunk(
  "orders/yearlydata",
  async (data, thunkAPI) => {
    try {
      return await authService.getYearlyStats(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Login successful"; // Ensure this is a string
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Login failed"; // Ensure this is a string
        state.isLoading = false;
      })

      // Get orders cases
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = "Orders fetched successfully"; // Ensure this is a string
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch orders"; // Ensure this is a string
        state.isLoading = false;
      })

      // Update order cases
      .addCase(updateAOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.updateorder = action.payload;
        state.message = "Order updated successfully"; // Ensure this is a string
        toast.success("Order Status Changed");
      })
      .addCase(updateAOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to update order"; // Ensure this is a string
        state.isLoading = false;
      })

      // Get a single order cases
      .addCase(getaOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.singleorder = action.payload;
        state.message = "Order fetched successfully"; // Ensure this is a string
      })
      .addCase(getaOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch order"; // Ensure this is a string
        state.isLoading = false;
      })

      // Get monthly data cases
      .addCase(getMonthlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.monthlyData = action.payload;
        state.message = "Monthly data fetched successfully"; // Ensure this is a string
      })
      .addCase(getMonthlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch monthly data"; // Ensure this is a string
        state.isLoading = false;
      })

      // Get yearly data cases
      .addCase(getYearlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getYearlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.yearlyData = action.payload;
        state.message = "Yearly data fetched successfully"; // Ensure this is a string
      })
      .addCase(getYearlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch yearly data"; // Ensure this is a string
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;