import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '@shared/lib/utils';

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export const getEmployees = createAsyncThunk('employee/getEmployees', async (params = {}) => {
  const query = new URLSearchParams();
  if (params.FullName) query.append('FullName', params.FullName);
  if (params.PageNumber && params.PageSize) {
    query.append('PageNumber', params.PageNumber);
    query.append('PageSize', params.PageSize);
  }
  const url = `${apiUrl}/api/Employee${query.toString() ? `?${query}` : ''}`;
  const { data } = await axios.get(url, authHeader());
  return data;
});

export const addEmployee = createAsyncThunk('employee/addEmployee', async (newEmployee) => {
  await axios.post(`${apiUrl}/api/Employee`, newEmployee, authHeader());
  return newEmployee;
});

export const editEmployee = createAsyncThunk('employee/editEmployee', async (updEmployee) => {
  await axios.put(`${apiUrl}/api/Employee/${updEmployee.id}`, updEmployee, authHeader());
  return updEmployee;
});

export const deleteEmployee = createAsyncThunk('employee/deleteEmployee', async (id) => {
  await axios.delete(`${apiUrl}/api/Employee/${id}`, authHeader());
  return id;
});

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
    statusCode: 200,
    employees: [],
    employee: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
        state.statusCode = action.payload.statusCode;
        state.employees = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e.id !== action.payload);
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      });
  },
});

export default employeeSlice.reducer;
