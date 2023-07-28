import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useSelector} from 'react-redux'
import {useSendDropdownMutation} from "./Services/productsApi"
import { LineChart, Line,Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Dropdowns = () => {
  const columns = useSelector((state)=>state.csv.actualCsvColumn)
  const actualColumn = useSelector((state)=>state.csv.columns)
  const [columData,setColumnData] = useState([])
  const [sendDropdown,{isLoading,isError,data}] = useSendDropdownMutation() || {}
  const col = {}
  const mlDataPlot = useSelector((state)=>state.csv.processedMlData)
  // const allKeys = columData.flatMap(obj => Object.keys(obj));

  const addColumns = (e,column)=>{
   col[column] = e.target.value
   const keyToSearch = column;
   const keyExists = columData.some(obj => keyToSearch in obj);
   if(keyExists)
   {
    for (const obj of columData) {
      if (column in obj) {
        obj[column] = e.target.value;
      }
    }
   }
   setColumnData(prev=>[...prev,col])
  }
  
  const sendDropData = ()=>{
    console.log(columData);
    sendDropdown(columData)
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"center"}}>
    
    <div>
    {
      actualColumn.map((Acolumn)=>{
        return (
          <div>
            <h3>{Acolumn}</h3>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
    <InputLabel id="demo-select-small-label">Select a column</InputLabel>
    <Select
      labelId="demo-select-small-label"
      id="demo-select-small"
      label="Select a Column"
      onChange={(e)=>addColumns(e,Acolumn)}
    >
      {
        columns.map((column)=>{
          return <MenuItem value={column}>
          <em>{column}</em>
        </MenuItem>
        })
      }
    </Select>
  </FormControl>
            </div>
        )
      })
    }
  </div>
  <div>
    <button onClick={sendDropData} style={{marginLeft:"60px",marginTop:"50px",height:"30px"}}>Generate Result</button>
    {isLoading && <p>Loading..</p>}
    {isError && <p>Error..</p>}
  </div>
  </div>
  {data &&
   <div>
   <LineChart
      width={800}
      height={400}
      data={mlDataPlot}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="voltage" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="power" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="current" stroke="red" />
      <Brush dataKey="voltage" height={30} stroke="#8884d8" />
    </LineChart>
   </div> 
   }
    </div>
  )
}

export default Dropdowns