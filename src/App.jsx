import './App.css'
import React, { useState,useEffect } from 'react';
import {useCsvDataMutation,useActualCsvMutation} from './Services/productsApi'
import { useSelector } from 'react-redux';
import { LineChart, Line,Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Table from './table';
import ActualTable from './actualTable';
import Dropdowns from './dropdown';


function App() {
  
  const [csvFile, setCsvFile] = useState(null);
  const [actualcsvFile, setActualCsvFile] = useState(null);
  const [csvData,{isError,isLoading,data}] = useCsvDataMutation() || {};
  const [actualCsv,actualData] = useActualCsvMutation() || {};

    const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };
    const handleActualFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setActualCsvFile(file);
    }
  };
  const csvFileData = useSelector((state)=>state.csv.csvData)
  


  const handleFileUpload = async() => {
    if (csvFile) {
      const formData = new FormData();
      formData.append('file', csvFile);
     await csvData(formData)
    }
  }
  const handleActualFileUpload = async() => {
    if (actualcsvFile) {
      const formData = new FormData();
      formData.append('files', actualcsvFile);
     await actualCsv(formData)
    }
  }

  return (
    <>
      <div>
       <input type='file' onChange={handleFileChange} accept='.csv'></input>
       <button onClick={handleFileUpload}>Upload CSV</button>
       <br></br>
       <br></br>
       {isLoading && <h3>Loading..</h3>}
       {isError && <h3>404 Not Found</h3>}
       {data && <h3>Ideal Dataset uploaded Successfully!</h3>}
      </div>
      {
        data && 
       
      <>
       <div style={{display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
       <div style={{alignSelf:"center"}}>
        <Table/>
        </div>
       <div>
       <LineChart
          width={800}
          height={400}
          data={csvFileData}
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
        
       </div>
       <div>
        <h3>Upload your Actual Dataset</h3>
        <input type='file' onChange={handleActualFileChange} accept='.csv'></input>
        <button onClick={handleActualFileUpload}>Upload Dataset</button>
       </div>
      </>
        }
        <br></br>
        <br></br>
        <br></br>
        {
          actualData.data && 
          <div style={{display:"flex",justifyContent:"space-evenly"}}>
            <div><ActualTable/></div>
            <div style={{alignSelf:"start"}}>
              <Dropdowns/>
            </div>
          </div>
        }
    </>
  )
}

export default App
