import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Autocomplete, Box, Divider, IconButton, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import "dayjs/locale/th";
import SearchIcon from '@mui/icons-material/Search';
import { serverFetch } from '@/lib/serverFetch'
import { GetServerSidePropsContext } from 'next'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import exceljs from "exceljs";
import { saveAs } from 'file-saver'

interface IFacOpt {
  label: string;
  id: string;
}

interface IFormInput {
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  fac: string
}

interface Props {
  options: IFacOpt[]
}

const formattedNumber = (n: number) => {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const report = ( { options }: Props ) => {
  const axiosAuth = useAxiosAuth();
  const [ data, setData ] = useState<any>();
  const { handleSubmit, control, formState: { errors, }, reset, getValues  } = useForm<IFormInput>({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    }
  });
  const onSubmit: SubmitHandler<IFormInput> = async(data) => { 
    try {
      const res = await axiosAuth.post('/report', data);
      setData(res.data);
    } catch (error) {
      
    }
  };
  const createExcel = async() => {
    try {
      let wb = new exceljs.Workbook();
      let ws = wb.addWorksheet("report");
      data.forEach( (fac:any) => {
          const facName = Object.keys(fac)[0];
          fac[facName].forEach( (item:any) => {
              const { plan, product, type, items } = item;
              let { totalAmount } = item;
              ws.addRow( [ facName ] );
              ws.addRow( [ plan ] );
              ws.addRow( [ product ] );
              ws.addRow( [ type, "เงินที่ได้รับ", totalAmount, 'บาท' ] );
              ws.addRow( [ "itemcode", "ชื่อรายการ", "เลขที่ มอ.", "จำนวนเงินที่เบิกจ่าย", "วันที่เบิกจ่าย", "ยอดเงินคงเหลือ" ] );
              items.forEach( (item:any) => {
                  const { code, name, date, psu_code } = item;
                  let { withdrawal_amount } = item;
                  withdrawal_amount = parseFloat(withdrawal_amount);
                  totalAmount = parseFloat(totalAmount) - withdrawal_amount;
                  ws.addRow( [ code, name, psu_code, withdrawal_amount, date, totalAmount  ] );
              })
              ws.addRow( [ "ยอดเงินคงเหลือ", totalAmount, "บาท"  ] );
          });
          ws.addRow([]);
      })

        const buf = await wb.xlsx.writeBuffer();
        
        saveAs(new Blob([buf]), 'report.xlsx')

    } catch (error) {
      
    }
    
  }
  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex">
          <Controller 
            name='startDate'
            control={control}
            render={({ field }) => <DatePicker
                                      label='วันที่เริ่มต้น'
                                      format='DD/MM/YYYY'
                                      value={field.value}
                                      onChange={(date) => {
                                        field.onChange(date);
                                      }
                                      }
                                    />
            }
          />
          <p style={ { borderBottom: "1.5px solid rgb(80, 80, 78)", width: "30px", margin:"auto 10px auto 10px" } }></p>
          <Controller 
            name='endDate'
            control={control}
            render={({ field }) => <DatePicker
                                      label='วันที่สุดท้าย'
                                      format='DD/MM/YYYY'
                                      value={field.value}
                                      onChange={(date) => field.onChange(date) }
                                    />
            }
          />
          <Controller
            name='fac'
            control={control} 
            rules={{ required: 'กรุณาเลือกคณะ' }}
            render={({ field }) => {
              const { onChange } = field;
              return (
                    <Box sx={{ marginLeft: "10px"}} width={320}>
                      <Autocomplete
                        onChange={(event: any, newValue) => onChange(newValue ? newValue.id : null) }
                        options={ options }
                        renderInput={ (params) => <TextField 
                                                    {...params} 
                                                    label= "เลือกคณะ" 
                                                    error={!!errors.fac}
                                                    helperText={errors.fac?.message}
                                                  /> 
                      }
                      />
                    </Box>
                )}}
          />
          <IconButton type='submit' sx={{ marginLeft: "10px" }}>
            <SearchIcon/>
          </IconButton>
          <IconButton sx={{ marginLeft: "10px" }} onClick={createExcel}>
            <FileDownloadIcon/>
          </IconButton>
        </Box>
      </form>
      <Box>
        <Box 
          textAlign="center"
          sx ={{
            margin:"20px auto",
            textAlign:"center",
            scrollBehavior:"smooth",
            overflowY: "auto",
            width: "90%",
            height: "700px" 
          }}
        >
          <Typography variant='h3'>รายการเบิกจ่าย</Typography>
          { !!data && data.map( (fac:any, index:number) => {
            const facName = Object.keys(fac)[0];
          
            return (
              <Box
                key={index}
              >
                { fac[facName].map( ( item:any, index:number ) => {
                  const { plan, product, type, items } = item;
                  let { totalAmount } = item;
                  let sum = 0;
                  totalAmount = parseFloat(totalAmount)
                  let totalAmountDisplay = formattedNumber(totalAmount);
                  return (
                    <Box key={index}>
                      <Typography>{facName}</Typography>
                      <Typography>{plan}</Typography>
                      <Typography>{product}</Typography>
                      <Typography>{type} เงินที่ได้รับ {totalAmountDisplay} บาท</Typography>
                      <Table sx={{ border: '1px solid #000', marginTop:"10px", marginBottom:"20px"}} >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ border: '1px solid #000'}}  width={130}>วันที่เบิกจ่าย</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}  width={130}>เลขที่ มอ.</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}} width={100}>itemcode</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}  width={600}>ชื่อรายการ</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}  width={150}>จำนวนเงินที่เบิกจ่าย</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}  width={100}>ยอดเงินคงเหลือ</TableCell>
                          </TableRow>
                        </TableHead>
                            <TableBody key={index}>
                            { items.map((item:any, index:number) => {
                              const { code, name, date, psu_code } = item;
                              let { withdrawal_amount } = item;
                              withdrawal_amount = parseFloat(withdrawal_amount);
                              totalAmount = totalAmount - withdrawal_amount;
                              sum += withdrawal_amount
                              return (
                                        <TableRow key={index}>
                                          <TableCell sx={{ border: '1px solid #000' }}>{dayjs(date).format("DD/MM/YYYY")}</TableCell>
                                          <TableCell sx={{ border: '1px solid #000' }}>{psu_code}</TableCell>
                                          <TableCell sx={{ border: '1px solid #000' }}>{code}</TableCell>
                                          <TableCell sx={{ border: '1px solid #000' }}>{name}</TableCell>
                                          <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(withdrawal_amount)}</TableCell>
                                          <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(totalAmount)}</TableCell>
                                        </TableRow>
                              )})}
                              <TableRow>
                                <TableCell sx={{ border: '1px solid #000' }} colSpan={4}>ยอดเงินคงเหลือ</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(sum)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(totalAmount)} บาท</TableCell>
                              </TableRow>
                            </TableBody>
                      </Table>
                    </Box>
                  )
                } ) }
              </Box>
            )
          })
          }
        </Box>
      </Box>
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