import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from '../slices/sliceTypes'

const userSlice = createSlice({
    name:'user',
    initialState: null as User | null,
    reducers:{
        setUser: (state,action:PayloadAction<User>)=>{
            return action.payload;
        }
    }
})

export default userSlice