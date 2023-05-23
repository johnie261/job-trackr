import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import customFetch from "../../utils/axios";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";

const initialState = {
    isLoading: false,
    isSidebarOpen: false,
    user: getUserFromLocalStorage()
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
        try {
            const resp = await customFetch.post('/auth/login', user)
            return resp.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.msg)
        }
})

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch('/auth/updateUser', user, {
        headers: {
          // authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
          Authorization: `Bearer`
        },
      });
      return resp.data;
    } catch (error) {
        if(error.response.status === 401){
            thunkAPI.dispatch(logoutUser())
            return thunkAPI.rejectWithValue('Unauthorized! Logging out...')
        }
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen
        },
        logoutUser: (state, {payload}) => {
            state.user = null
            state.isSidebarOpen = false
            removeUserFromLocalStorage()
            if (payload) {
                toast.success(payload)
            }
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(RegisterUser.pending, (state) => ({
            ...state,
            isLoading: true
        }))
        .addCase(RegisterUser.fulfilled, (state, {payload}) => {
            const {user} = payload
            addUserToLocalStorage(user)
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
        .addCase(LoginUser.pending, (state) => ({
            ...state,
            isLoading: true
        }))
        .addCase(LoginUser.fulfilled, (state, {payload}) => {
            const {user} = payload
            addUserToLocalStorage(user)
            toast.success(`Welcome back ${user.name}`)
            return {
                ...state,
                isLoading: false,
                user: user,
            }
        })
        .addCase(LoginUser.rejected, (state, {payload}) => {
            toast.error(payload)
            return {
                ...state,
                isLoading: false
            }
        })
        .addCase(updateUser.pending, (state) => ({
            ...state,
            isLoading: true
        }))
        .addCase(updateUser.fulfilled, (state, {payload}) => {
            const {user} = payload
            addUserToLocalStorage(user)
            toast.success(`User profile updated`)
            return {
                ...state,
                isLoading: false,
                user: user,
            }
        })
        .addCase(updateUser.rejected, (state, {payload}) => {
            toast.error(payload)
            return {
                ...state,
                isLoading: false
            }
        })
    }
})

export const {toggleSidebar, logoutUser} = userSlice.actions;
export default userSlice.reducer;