import React from 'react'
import {useSelector} from 'react-redux'
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';


const Table = () => {
    const data = useSelector((state)=>state.csv.csvData)
    const columns = useSelector((state)=>state.csv.columns)
    const s2Options = {
        width: 600,
        height: 400,
      };
  
      const s2DataConfig = {
        fields: {
          columns: columns,
        },
        data: data,
      };
  return (
    <div>
       <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="table"
      />
    </div>
  )
}

export default Table
