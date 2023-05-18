import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import customFetch from "../../utils/axios";

const initialState = {
    isLoading: false,
    user: null
};

export const RegisterUser = createAsyncThunk('user/registerUser',
    async (user, thunkAPI) => {
        try {
            const resp = await customFetch.post('/auth/register', user)
            return resp.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg)
        }
})

export const LoginUser = createAsyncThunk('user/loginUser',
    async (user, thunkAPI) => {
        console.log(`Login User : ${JSON.stringify(user)}`)
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers : (builder) => {
        builder
        .addCase(RegisterUser.pending, (state) => ({
            ...state,
            isLoading: true
        }))
        .addCase(RegisterUser.fulfilled, (state, {payload}) => {
            const {user} = payload
            toast.success(`Hello there ${user.name}`)
            return {
                ...state,
                isLoading: false,
                user: user,
            }
        })
        .addCase(RegisterUser.rejected, (state, {payload}) => {
            toast.error(payload)
            return {
                ...state,
                isLoading: false
            }
        })
    }
})

export default userSlice.reducer;