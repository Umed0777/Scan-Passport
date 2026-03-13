import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '@shared/lib/utils';
import axios from 'axios';

const saveToken = (token) => localStorage.setItem('access_token', token);
const deleteToken = () => localStorage.removeItem('access_token');
const getToken = () => localStorage.getItem('access_token');

export const logIn = createAsyncThunk('auth/logIn', async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/Auth/login`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error.data?.message);
  }
});

export const register = createAsyncThunk('auth/register', async (newUser, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/Auth/register`, newUser, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: getToken(),
    loading: false,
    error: null,
  },
  reducers: {
    setToken(state) {
      state.data = getToken();
    },
    logout(state) {
      state.data = null;
      state.error = null;
      deleteToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        const { data, message } = action.payload;
        if (data) {
          state.data = data;
          saveToken(data);
          state.error = null;
        } else {
          state.data = null;
          state.error = message;
        }
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
