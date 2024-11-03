import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import {userSlice} from '../store/slices/userSlice';
import { adminSlice } from './slices/adminSlice';
import { institutionSlice } from './slices/institutionSlice';

const rootReducer = combineReducers({
    auth:authReducer,
    user:userSlice,
    admin:adminSlice,
    institution:institutionSlice
});

export default rootReducer;