import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Autocomplete, Box, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography } from '@mui/material'
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
import { saveAs } from 'file-saver';
import toast, { Toaster } from "react-hot-toast";
import Checkbox from '@mui/material/Checkbox';

interface IFacOpt {
  label: string;
  id: string;
}

interface IFormInput {
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  fac: string,
  begin: boolean,
  mode: "N" | "S"
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
  const [ begin, setBegin ] = useState<boolean>(false);
  const [ mode, setMode ] = useState<"N"|"S">("N");
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
      toast.error( error.response.data.error );
    }
  };
  const createExcel = async() => {
    try {
      let wb = new exceljs.Workbook();
      let ws = wb.addWorksheet("report");
      if ( mode === "N" ){
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
        ws.addRow([""])});
      } else if ( mode  === "S" ){
      }

        const buf = await wb.xlsx.writeBuffer();
        
        saveAs(new Blob([buf]), 'report.xlsx')

    } catch (error) {
      toast.error( JSON.stringify(error) );
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
                                      onChange={(date) => field.onChange(date) }
                                      disabled={begin}
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
                                      disabled={begin}
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
        <Box marginTop="10px" display="flex">
          <Controller
            name='begin'
            control={control}
            render={({field}) => {
              const { name, value, onChange } = field
              return (
                <FormControlLabel
                  sx={{ marginLeft:"2px"}}
                  control={
                    <Checkbox 
                      name={name}
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(e.target.checked);
                        setBegin(e.target.checked);
                      }}
                  />
                  } 
                  label="ตั้งแต่เริ่มต้น"
                />
              )
            }}
          />
          <Controller
            control={control}
            name='mode'
            render={ ({field}) => {
              const { name, value, onChange } = field
              return (
              <RadioGroup row defaultValue="N" 
                value={value}
                name={name}
                onChange={ (e) => {
                  onChange(e.target.value)
                  setMode( ( e.target.value ) as "N" | "S")
                  setData(null)
                }}
              >
                                      <FormControlLabel value="N" control={<Radio />} label="เงินประจำปี" />
                                      <FormControlLabel value="S" control={<Radio />} label="เงินกัน" />
              </RadioGroup>
              )
            }}
          />
        </Box>
      </form>
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
      { mode === "N" ?
        <Box>
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
                              <TableCell sx={{ border: '1px solid #000'}}>วันที่เบิกจ่าย</TableCell>
                              <TableCell sx={{ border: '1px solid #000'}}>เลขที่ มอ.</TableCell>
                              <TableCell sx={{ border: '1px solid #000'}}>itemcode</TableCell>
                              <TableCell sx={{ border: '1px solid #000'}}>ชื่อรายการ</TableCell>
                              <TableCell sx={{ border: '1px solid #000'}}>จำนวนเงินที่เบิกจ่าย</TableCell>
                              <TableCell sx={{ border: '1px solid #000'}}>ยอดเงินคงเหลือ</TableCell>
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
        : 
        <Box>
            <Typography variant='h3'>รายการเงินกัน</Typography>
            { !!data && data.map( (fac:any, index:number) => {
              const facName = Object.keys(fac)[0];
              const { name } = fac[facName];
              let { total_amount } = fac[facName]
              total_amount = parseFloat(total_amount);
              const totalAmountDisplay = formattedNumber(total_amount);
              let sum = 0;
              return (
                <Box
                  key={index} 
                >
                  <Typography>{facName}</Typography>
                  <Typography>{name}</Typography>
                  <Typography>เงินที่ได้รับ {totalAmountDisplay} บาท</Typography>
                  <Table>
                    <TableRow>
                      <TableCell sx={{ border: '1px solid #000'}}>วันที่เบิกจ่าย</TableCell>
                      <TableCell sx={{ border: '1px solid #000'}}>เลขที่ มอ.</TableCell>
                      <TableCell sx={{ border: '1px solid #000'}}>itemcode</TableCell>
                      <TableCell sx={{ border: '1px solid #000'}}>จำนวนเงินที่เบิกจ่าย</TableCell>
                      <TableCell sx={{ border: '1px solid #000'}}>ยอดเงินคงเหลือ</TableCell>
                    </TableRow>
                    <TableBody>
                  { fac[facName].items.map( (item:any, index:number) => {
                    const { code, date, psu_code } = item;
                    let { withdrawal_amount } = item;
                    withdrawal_amount = parseFloat(withdrawal_amount);
                    total_amount -= withdrawal_amount;
                    sum += withdrawal_amount;
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ border: '1px solid #000' }}>{dayjs(date).format("DD/MM/YYYY")}</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{psu_code}</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{code}</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(withdrawal_amount)}</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(total_amount)}</TableCell>
                      </TableRow>
                    )})}
                      <TableRow>
                        <TableCell sx={{ border: '1px solid #000' }} colSpan={3}>ยอดเงินคงเหลือ</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(sum)}</TableCell>
                        <TableCell sx={{ border: '1px solid #000' }}>{formattedNumber(total_amount)} บาท</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )
            })}
        </Box> 
      }
      </Box>
      <Toaster/>
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