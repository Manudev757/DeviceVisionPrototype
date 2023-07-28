import {configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import {sendcsvApi} from '../Services/productsApi'
import csvReducer from "../Slice/csvSlice"

export const store = configureStore({
    reducer : {
     [sendcsvApi.reducerPath] : sendcsvApi.reducer,   
    csv : csvReducer,
    },
    middleware: getDefaultMiddleware().concat(sendcsvApi.middleware), 
})