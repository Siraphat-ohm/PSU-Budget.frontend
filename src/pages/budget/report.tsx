import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import "dayjs/locale/th";
import { serverFetch } from '@/lib/serverFetch'
import { GetServerSidePropsContext } from 'next'
import toast, { Toaster } from "react-hot-toast";
import { IFacOpt, IFormInput, mode } from '@/models/report.mode'
import ReportForm from '@/components/Reports/ReportForm'
import { excelUtils } from '@/util/excelUtils'
import { ReportData } from '@/components/Reports/ReportData'

interface Props {
  options: IFacOpt[]
}

const report = ( { options }: Props ) => {
  const axiosAuth = useAxiosAuth();
  const [ data, setData ] = useState<any>();
  const [ begin, setBegin ] = useState<boolean>(true);
  const [ mode, setMode ] = useState<mode>("N");
  const { handleSubmit, control, formState: { errors, } } = useForm<IFormInput>({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      mode: 'N',
      fac: options[0].id,
      begin: true,
      status: "N"
    }
  });
  const onSubmit: SubmitHandler<IFormInput> = async(data) => { 
    try {
      const res = await axiosAuth.post('/report', data);
      console.log(res.data);
      setData(res.data);
     
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
      toast.error( errorMessage );
    }
  };

  const createExcel = async() => {
    excelUtils(mode, data);
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
          width:"fit-content",
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
        }}}
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