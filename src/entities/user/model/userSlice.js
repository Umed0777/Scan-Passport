import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "@shared/lib/utils";
import axios from "axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async ({ PageNumber, PageSize } = {}) => {
    const url =
      PageNumber && PageSize
        ? `${apiUrl}/api/User?PageNumber=${PageNumber}&PageSize=${PageSize}`
        : `${apiUrl}/api/User`;
    const { data } = await axios.get(url, authHeader());
    return data;
  },
);

export const editUser = createAsyncThunk("user/editUser", async (updUser) => {
  await axios.put(`${apiUrl}/api/User/${updUser.id}`, updUser, authHeader());
  return updUser;
});
export const addUser = createAsyncThunk(
  "user/addUser",
  async ({ userName, email, password, confirmPassword }) => {
    const formData = new FormData();
    formData.append("UserName", userName);
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);

    const token = localStorage.getItem("access_token");

   const res= await axios.post(`${apiUrl}/api/Auth/register`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("SERVER RESPONSE:", res.data);
    return true;
  },
);

export const deleteUser = createAsyncThunk("user/deleteUser", async (id) => {
  await axios.delete(`${apiUrl}/api/User/${id}`, authHeader());
  return id;
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
  totalRecords: 0,
  statusCode: 200,
  users: [],
  message: null,
  isLoading: false,
  error: null
},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
  state.pageNumber = action.payload.pageNumber;
  state.pageSize = action.payload.pageSize;
  state.totalPages = action.payload.totalPages;
  state.statusCode = action.payload.statusCode;
  state.users = action.payload.data;

  state.isLoading = false;
  state.error = null;
})
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((e) => e.id !== action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload,
          };
        }
      });
  },
});

export default userSlice.reducer;
