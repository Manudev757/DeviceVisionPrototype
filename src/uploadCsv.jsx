import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Progress, Upload } from 'antd';
import {useCsvDataMutation,useActualCsvMutation} from './Services/productsApi'


const UploadCsv = () => {
    const [csvData,{isError}] = useCsvDataMutation() || {};
    const [percent,setPercent] = useState(0)
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
          const response =  csvData(formData);
          setTimeout(()=>{
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

  return (
    <div style={{width:"300px"}}>
    <Upload customRequest={handleCustomRequest}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
      { loading && <Progress percent={percent}  />}
      {isError && <div>Error</div>}
  </Upload>
    </div>
  )
}

export default UploadCsv

