import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/auth';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Return error from backend
        return rejectWithValue(data);
      }

      return data; // Return user data on success
    } catch (error) {
      return rejectWithValue({ error: 'Network error. Please try again.' });
    }
  },
);

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Response Status:", response.status, "Data:", data);

    if (!response.ok) {
        console.log("object")
      // Return error from backend
      return rejectWithValue(data);
    }

    localStorage.setItem('token', data.token);
    console.log(data)
    return data; // Return user data on success
  } catch (error) {
    return rejectWithValue({ error: 'Network error. Please try again.' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token') || null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('User Registered:', action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
