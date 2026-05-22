// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, updateUser, deleteUser, getUser } from './authThunk';
import { normalizeUser } from '../../../utils/normalizeUser';

const stored = localStorage.getItem('user');
const parsedStored = stored ? JSON.parse(stored) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: normalizeUser(parsedStored),
    isLoggedIn: !!normalizeUser(parsedStored),
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser) {
        const normalized = normalizeUser(JSON.parse(storedUser));
        state.user = normalized;
        state.isLoggedIn = !!normalized || !!token;
      } else if (token) {
        state.isLoggedIn = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        const normalized = normalizeUser(action.payload?.user);
        if (normalized) {
          state.user = normalized;
          localStorage.setItem('user', JSON.stringify(normalized));
        }
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        const normalized = normalizeUser(action.payload?.user);
        if (normalized) {
          state.user = normalized;
          localStorage.setItem('user', JSON.stringify(normalized));
        }
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeUser(action.payload);
        state.user = normalized;
        if (normalized) {
          localStorage.setItem('user', JSON.stringify(normalized));
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Update failed';
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Delete failed';
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeUser(action.payload);
        if (normalized) {
          state.user = normalized;
          state.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(normalized));
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Get user failed';
      });
  }
});

export const { logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
