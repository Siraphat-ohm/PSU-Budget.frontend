import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Autocomplete, Box, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import "dayjs/locale/th";
import { serverFetch } from '@/lib/serverFetch'
import { GetServerSidePropsContext } from 'next'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import exceljs from "exceljs";
import { saveAs } from 'file-saver';
import toast, { Toaster } from "react-hot-toast";
import { IFacOpt, IFormInput, ITableRecD, ITableRecN, mode } from '@/models/report.mode'
import ReportForm from '@/components/Reports/ReportForm'
import ReportData from '@/components/Reports/ReportData'
import { displayNumber } from '../../../util/displayNumber'

interface Props {
  options: IFacOpt[]
}

const report = ( { options }: Props ) => {
  const axiosAuth = useAxiosAuth();
  const [ data, setData ] = useState<any>();
  const [ begin, setBegin ] = useState<boolean>(false);
  const [ mode, setMode ] = useState<mode>("N");
  const { handleSubmit, control, formState: { errors, } } = useForm<IFormInput>({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      mode: 'N'
    }
  });
  const onSubmit: SubmitHandler<IFormInput> = async(data) => { 
    try {
      const res = await axiosAuth.post('/report', data);
      setData(res.data);
     
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
      toast.error( errorMessage );
    }
  };
  const createExcel = async() => {
    try {
      console.log(data);
      let wb = new exceljs.Workbook();
      let ws = wb.addWorksheet("report");
      if ( mode === "N" ){
      } else if ( mode  === "D" ){
      }
      const buf = await wb.xlsx.writeBuffer();
        
      saveAs(new Blob([buf]), 'report.xlsx')
    } catch (error) {
      toast.error( JSON.stringify(error) );
    }
    
  }
  return (
    <Layout>
      <ReportForm
        begin={begin}
        control={control}
        createExcel={createExcel}
        errors={errors}
        handleSubmit={handleSubmit}
        mode={mode}
        onSubmit={onSubmit}
        options={options}
        setBegin={setBegin}
        setData={setData}
        setMode={setMode}
      />
      <Box 
        textAlign="center"
        sx ={{
          margin:"50px auto",
          textAlign:"center",
          scrollBehavior:"smooth",
          overflowY: "auto",
          width: "100%",
          height: "700px" 
        }}
      >
        <ReportData
          data={data}
          mode={mode}
        />
      </Box>
      <Toaster
        position='top-right' 
        toastOptions={{
        style: {
          fontSize: '20px',
          marginTop: '50px'
        }
        }}
      />
    </Layout>
  )
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await serverFetch(context, '/report/opt');
  
  return {
    props: { options: res.data },
  };
};

export default report;