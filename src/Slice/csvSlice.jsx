import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    csvData : [],
    mlData : [],
    columns:[],
    actualCsv:[],
    actualCsvColumn:[],
    processedMlData:[]
}

const csvSlice = createSlice({
    name : 'csv',
    initialState,
    reducers : {
        storeCsvData : (state,action)=>{
            console.log(action);
            state.csvData = action.payload.content
            state.columns = action.payload.columns
        },
        storeML: (state,action)=>{
            state.mlData = action.payload
        },
        storeActualCsv : (state,action)=>{
            state.actualCsv = action.payload.content
            state.actualCsvColumn = action.payload.columns
        },
        plotMlData : (state,action)=>{
            state.processedMlData = action.payload
        }
    }
})
export const { storeCsvData,storeML,storeActualCsv,plotMlData } = csvSlice.actions;
export default csvSlice.reducer;