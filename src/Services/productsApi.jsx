import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {storeActualCsv,storeCsvData,storeML,plotMlData} from '../Slice/csvSlice'

export const sendcsvApi = createApi({
    reducerPath : "sendcsvApi",
    baseQuery : fetchBaseQuery({
        baseUrl :  'http://localhost:3000/'
    }),
    endpoints : (builder) => ({
        csvData : builder.mutation({
            query : (formData)=> ({
                url: '/csvfile',
                method : 'POST',
                body : formData
            }),
            async onQueryStarted(res, { dispatch, queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;
                 dispatch(storeCsvData(data.csv))
                 dispatch(storeML(data.ml))
                } catch (err) {
                  console.log("error... ", err);
                }
              },
        }),
        actualCsv : builder.mutation({
            query : (formData)=>({
                url : '/actualcsv',
                method : 'POST',
                body : formData
            }),
            async onQueryStarted(res, { dispatch, queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;
                  dispatch(storeActualCsv(data))
                } catch (err) {
                  console.log("error... ", err);
                }
              },
        }),
        sendDropdown : builder.mutation({
          query : (columData)=>({
              url : '/dropdownvalue',
              method : 'POST',
              body : columData
          }),
          async onQueryStarted(res, { dispatch, queryFulfilled }) {
              try {
                const { data } = await queryFulfilled;
                dispatch(plotMlData(data))
              } catch (err) {
                console.log("error... ", err);
              }
            },
      })
    }),
})

export const {useCsvDataMutation,useActualCsvMutation,useSendDropdownMutation} = sendcsvApi