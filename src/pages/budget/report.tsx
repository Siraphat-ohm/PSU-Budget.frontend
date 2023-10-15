import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Box } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import "dayjs/locale/th";
import { serverFetch } from '@/lib/serverFetch'
import { GetServerSidePropsContext } from 'next'
import exceljs from "exceljs";
import { saveAs } from 'file-saver';
import toast, { Toaster } from "react-hot-toast";
import { IFacOpt, IFormInput, ITableRecD, ITableRecN, mode } from '@/models/report.mode'
import ReportForm from '@/components/Reports/ReportForm'
import ReportData from '@/components/Reports/ReportData'

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
      let wb = new exceljs.Workbook();
      let ws = wb.addWorksheet("report");
      if ( mode === "N" ){
        ws.columns = [ 
          { width: 50 }, 
          { width: 17 }, 
          { width: 17 }, 
          { width: 50 }, 
          { width: 20 }, 
          { width: 15 }, 
          { width: 25 }, 
        ]
        let start = 6;
        data?.forEach( ( fac:any ) => {
          const facName = Object.keys(fac)[0];
          fac[facName].forEach( ( item: ITableRecN ) => {
            const { plan, product, type, records, total_amount } = item;
            let balance = +total_amount;
            const length = records.length;
            let sum = 0;
            
            ws.addRow( [ facName ] );
            ws.addRow( [ plan ] );
            ws.addRow( [ product ] );
            ws.addRow( [ type ] );
            ws.addRow( [ 'เงินที่ได้รับ', balance, 'บาท' ]  );
            const rows = records.map( item => { 
              const { code, date, name, note, psu_code, withdrawal_amount } = item;
              balance -= +withdrawal_amount 
              sum += +withdrawal_amount
              return [ date, psu_code, code, name, +withdrawal_amount, balance, note ]
            });
            ws.addTable({
              name: `${records[0].code}`,
              ref: `A${start}`,
              headerRow: true,
              style: {
                theme: 'TableStyleMedium18',
                showRowStripes: true,
              },
              columns: [
                { name: 'วันที่เบิกจ่าย' },
                { name: 'เลขที่ มอ.'},
                { name: 'itemcode' },
                { name: 'ชื่อรายการ' },
                { name: 'จำนวนเงินที่เบิกจ่าย' },
                { name: 'คงเหลือ',  },
                { name: 'หมายเหตุ',  }
              ],
              rows: [ ...rows, [ 'ยอดเงินคงเหลือ', '', '', '', sum, balance ]],
            });
            const stop = start + length;
            ws.getCell(`B${start-1}`).style = { numFmt: "#,###.00" }
            let i ;
            for ( i = start + 1; i <= stop ; i++ ){
              ws.getCell(`E${i}`).style = { numFmt: "#,###.00" }
              ws.getCell(`F${i}`).style = { numFmt: "#,###.00" }
            }
            ws.getCell(`E${i}`).style = { numFmt: "#,###.00" }
            ws.getCell(`F${i}`).style = { numFmt: "#,###.00" }
            start += length + 8;
            ws.addRow( [] );
            });
        } );
      } else if ( mode  === "D" ){
        let start = 5
        ws.columns = [ 
          { width: 17 }, 
          { width: 18 }, 
          { width: 13 }, 
          { width: 20 }, 
          { width: 25 }, 
        ]
        data?.forEach( ( fac:any ) => {
          const facName = Object.keys(fac)[0];
          fac[facName].forEach( ( item: ITableRecD ) => {
            const { code, name, total_amount, records } = item;
            let balance = +total_amount;
            let sum = 0;
            const length = records.length;

            ws.addRow( [ facName ] );
            ws.addRow( [ code ] );
            ws.addRow( [ name ] );
            ws.addRow( [ 'เงินที่ได้รับ',  balance, 'บาท' ] );
            const rows = records.map( item => {
              const { date, note, psu_code, withdrawal_amount } = item;
              balance -= +withdrawal_amount;
              sum += +withdrawal_amount 
              return [ date, psu_code, +withdrawal_amount, balance, note ]
            });
            ws.addTable({
              name: `${records[0].psu_code}`,
              ref: `A${start}`,
              headerRow: true,
              style: {
                theme: 'TableStyleMedium18',
                showRowStripes: true,
              },
              columns: [
                { name: 'วันที่เบิกจ่าย' },
                { name: 'เลขที่ มอ.'},
                { name: 'จำนวนเงินที่เบิกจ่าย' },
                { name: 'คงเหลือ',  },
                { name: 'หมายเหตุ',  }
              ],
              rows: [ ...rows, [ 'ยอดเงินคงเหลือ', '', sum, balance ]],
            });
            const stop = start + length;
            ws.getCell(`B${start-1}`).style = { numFmt: "#,###.00" }
            let i ;
            for ( i = start + 1; i <= stop ; i++ ){
              ws.getCell(`D${i}`).style = { numFmt: "#,###.00" }
              ws.getCell(`C${i}`).style = { numFmt: "#,###.00" }
            }
            ws.getCell(`C${i}`).style = { numFmt: "#,###.00" }
            ws.getCell(`D${i}`).style = { numFmt: "#,###.00" }
            start += length + 7;
            ws.addRow( [] );
          })
        });
      }

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), 'report.xlsx')
    } catch (error:any) {
      console.log(error);
      const errorMessage = error.response?.data?.error || "ระบบเกิดข้อผิดพลาด" ;
      toast.error(errorMessage);
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