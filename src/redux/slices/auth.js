import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/auth/login', params);
        return data;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error.response.data);
    }
});

export const fetchLoginMe = createAsyncThunk(
    "/auth/fetchLoginMe",
    async () => {
        const response = await axios.get("/auth/me");
        return response.data;
    }
);

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/auth/register', params);
        return data;
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        return rejectWithValue(error.response.data);
    }
});

const initialState = {
    data: null,
    status: "loading",
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: {
        [fetchUserData.pending]: (state) => {
            state.data = null;
            state.status = "loading";
        },
        [fetchUserData.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "succeeded";
        },
        [fetchUserData.rejected]: (state, action) => {
            state.data = null;
            state.status = "error";
            state.error = action.payload
        },
        [fetchLoginMe.pending]: (state) => {
            state.data = null;
            state.status = "loading";
        },
        [fetchLoginMe.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "succeeded";
        },
        [fetchLoginMe.rejected]: (state) => {
            state.data = null;
            state.status = "error";
        },
        [fetchRegister.pending]: (state) => {
            state.data = null;
            state.status = "loading";
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "succeeded";
        },
        [fetchRegister.rejected]: (state, action) => {
            state.data = null;
            state.status = "error";
            state.error = action.payload
        }
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data)

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions
