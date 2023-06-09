import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { logoutUser } from '../users/userSlice';

const initialState = {
  isLoading: false,
  position: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  isEditing: false,
  editJobId: '',
};

export const createJob = createAsyncThunk('job/createJob',
async (job, thunkAPI) => {
  try {
    const resp = await customFetch.post('/jobs', job, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    })
    thunkAPI.dispatch(clearValues())
    return resp.data
  } catch (error) {
    if (error.response.status === 401){
      thunkAPI.dispatch(logoutUser())
      return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
    }
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
})

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
      handleChange: (state, {payload: {name, value}}) => {
        state[name] = value;
      },
      clearValues: () => {
        return initialState
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(createJob.pending, (state) => ({
            ...state,
            isLoading: true
        }))
        .addCase(createJob.fulfilled, (state, {payload}) => {
            toast.success(`Job created`)
            return {
                ...state,
                isLoading: false
            }
        })
        .addCase(createJob.rejected, (state, {payload}) => {
            toast.error(payload)
            return {
                ...state,
                isLoading: false
            }
        })
    }
})

export const {handleChange, clearValues} = jobSlice.actions;

export default jobSlice.reducer