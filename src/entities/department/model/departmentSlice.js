import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '@shared/lib/utils';

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const getDepartments = createAsyncThunk('department/getDepartments', async ({ PageNumber, PageSize } = {}) => {
  const url = PageNumber && PageSize ? `${apiUrl}/api/Department?PageNumber=${PageNumber}&PageSize=${PageSize}` : `${apiUrl}/api/Department`;
  const { data } = await axios.get(url, authHeader());
  return data;
});

export const getDepartmentById = createAsyncThunk('department/getDepartmentById', async (id) => {
  const { data } = await axios.get(`${apiUrl}/api/Department/${id}`, authHeader());
  return data;
});

export const addDepartment = createAsyncThunk('department/addDepartment', async (newDepartment) => {
  await axios.post(`${apiUrl}/api/Department`, newDepartment, authHeader());
});

export const editDepartment = createAsyncThunk('department/editDepartment', async (updDepartment) => {
  await axios.put(`${apiUrl}/api/Department/${updDepartment.id}`, updDepartment, authHeader());
  return updDepartment;
});

export const deleteDepartment = createAsyncThunk('department/deleteDepartment', async (id) => {
  await axios.delete(`${apiUrl}/api/Department/${id}`, authHeader());
  return id;
});

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
    statusCode: 200,
    departments: [],
    department: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
        state.statusCode = action.payload.statusCode;
        state.departments = action.payload.data;
        state.isLoading = action.payload.isLoading;
        state.error = action.payload.error;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getDepartmentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.department = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        const target = state.departments.find((e) => e.id === action.payload.id);
        if (target) target.name = action.payload.name;
      })

      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((e) => e.id !== action.payload);
      });
  },
});

export default departmentSlice.reducer;
