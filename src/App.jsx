import './App.css'
import React, { useState } from 'react';
import {useCsvDataMutation,useActualCsvMutation} from './Services/productsApi'
import { useSelector } from 'react-redux';
import { LineChart, Line,Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Table from './table';
import ActualTable from './actualTable';
import Dropdowns from './dropdown';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Progress, Upload } from 'antd';


function App() {
  
  const [actualcsvFile, setActualCsvFile] = useState(null);
  const [actualCsv,actualData] = useActualCsvMutation() || {};
  const [csvData,{isError,data,isLoading}] = useCsvDataMutation() || {};
    const [percent,setPercent] = useState(0)
    const [trigger,setTrigger] = useState(false)
    const [loading,setLoading]= useState(false)
    const incrementState =()=>{
        setPercent(prev=>prev+25)
    }

  const handleCustomRequest = ({ file,onError,onSuccess}) => { 
    setLoading(true) 
    setPercent(0)
    let intervalId =setInterval(incrementState,1000)
    try {
    const formData = new FormData()
    setLoading(!loading)
    formData.append('file',file)
    setTimeout(()=>{
        const response =  csvData(formData);
        onSuccess(setPercent(100))
        clearInterval(intervalId)
        setLoading(false)
    },4500)
      setPercent(0)
    } catch (error) {
      console.error(error);
      onError(error);
    }
}
    const handleActualFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setActualCsvFile(file);
    }
  };
  const csvFileData = useSelector((state)=>state.csv.csvData)
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
      <div style={{width:"300px"}}>
      <Upload customRequest={handleCustomRequest} accept='.csv'>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
      { loading && <Progress percent={percent}  />}
      {isError && <div>Error</div>}
  </Upload>
  </div>
       <br></br>  
       <br></br>
       {isLoading && <h3>Loading..</h3>}
       {isError && <h3>404 Not Found</h3>}
       {data && <h3>Ideal Dataset uploaded Successfully!</h3>}
       <button onClick={()=>setTrigger(!trigger)}>Show Preview</button>
      </div>
      <br></br>
      <br></br>
      {
        trigger && 
       
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
