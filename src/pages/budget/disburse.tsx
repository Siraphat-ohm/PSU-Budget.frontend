import { useState } from 'react';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { serverFetch } from '@/lib/serverFetch';
import { Layout } from '@/components/Layouts/Layout';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumbericTextField, NumericFormatCustom } from '@/components/Common/NumbericTextField';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { ReadOnlyTextField } from '@/components/Common/ReadOnlyField';
import toast, { Toaster } from 'react-hot-toast';

interface IFacOpt {
  label: string;
  id: string;
}

interface Props {
  options: {
    fac_opt: IFacOpt[];
    code_opt: any
  };
}

interface IFormInput {
  fac : string;
  code: string;
  psu_code: string;
  amount: string;
  date: Dayjs | null;
  note: string ;
}

interface ICode {
  name: string;
  balance: string;
  label: string;
}

const disburse = ({ options }: Props) => {
  const axiosAuth = useAxiosAuth();
  const [fac, setFac] = useState<IFacOpt | null>(null);
  const [code, setCode] = useState<ICode | null>(null);

  const { handleSubmit, control, formState: { errors, }, reset  } = useForm<IFormInput>({
    defaultValues : {
      psu_code: "",
      amount: "",
      date: dayjs(),
      note: "-"
    }
  })

  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    try {
      const res = await axiosAuth.post('/budget/disburse', data);
      if ( res.status === 201 ) toast.success( "เบิกจ่ายสำเร็จ" );
      setFac(null);
      setCode(null);
      reset()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <Typography variant="h2">ป้อนข้อมูลเบิกจ่าย</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" marginBottom="15px">
          <Controller
                name="fac"
                control={control}
                rules={{ required: 'กรุณาเลือกคณะ' }}
                render={({ field }) => {
                  const { onChange } = field;
                  return (
                    <Box sx={{ marginRight: "10px"}} width={320}>
                      <Autocomplete
                        value={fac}
                        onChange={(event: any, newValue) => {
                            onChange(newValue ? newValue.id : null) 
                            setFac(newValue)
                            setCode(null)
                          }}
                        options={options.fac_opt}
                        renderInput={ (params) => <TextField 
                                                    {...params} 
                                                    label= "เลือกคณะ" 
                                                    error={!!errors.fac}
                                                    helperText={errors.fac?.message}
                                                  /> 
                      }
                      />
                    </Box>
                  );
                }}
          />
          <Controller
                name="code"
                control={control}
                rules={{ required: 'กรุณาเลือก Itemcode' }}
                render={({ field }) => {
                  const { onChange } = field;
                  return (
                    <Box width={220}>
                      <Autocomplete
                        value={code}
                        onChange={(event: any, newValue: any) => {
                            onChange(newValue ? newValue.label : null);
                            setCode(newValue);
                          }}
                        options={ fac ? options.code_opt[fac.id] : [] }
                        renderInput={ (params) => <TextField 
                                                    {...params} 
                                                    label= "เลือกItemcode" 
                                                    error={!!errors.code}
                                                    helperText={errors.code?.message}
                                                  /> }
                      />
                    </Box>
                  );
                }}
          />
        </Box>

        <Box width={550} marginBottom="15px">
          <ReadOnlyTextField text={code?.name || ''} label='ชื่อรายการ'/>
        </Box>

        <Box marginBottom="15px" display="flex">
          <NumbericTextField label='เงินคงเหลือ' value={code?.balance || ''} readonly />
          <Controller
            name="psu_code"
            control={control}
            rules={{ required: 'กรุณากรอกเลขที่ มอ.' }}
            render={({ field }) => <TextField 
                                      sx={{ width: "290px" }} 
                                      label="เลขที่ มอ."
                                      error={!!errors.psu_code}
                                      helperText={errors.psu_code?.message}
                                      {...field} 
                                    />}
          />      
        </Box>
        
        <Box marginBottom="15px">
          <Controller 
            name='amount'
            control={control}
            rules={{ required: 'กรุณากรอกจำนวนเงิน' }}
            render={({ field }) => <TextField label="จำนวนเงิน"
                                        sx={{ marginRight: "10px", width:"250px" }}
                                        InputProps={{ inputComponent: NumericFormatCustom as any, }}
                                        error={!!errors.amount}
                                        helperText={errors.amount?.message}
                                        {...field}
                                      />}
          />
          <Controller 
            name='date'
            control={control}
            render={({ field }) => <DatePicker 
                                      sx={{ width:"290px" }}
                                      label='เลือกวันที่'
                                      format='DD/MM/YYYY'
                                      value={field.value}
                                      onChange={(date) => field.onChange(date)}
                                    />
            }
          />
        </Box>
          
        <Box marginBottom="15px">
          <Controller
            name='note'
            control={control}
            render={({ field }) => <Box width={550}>
                                    <TextField
                                        {...field}
                                        minRows={2}
                                        multiline
                                        fullWidth
                                        label='หมายเหตุ'
                                        variant='outlined'
                                    /> 
                                  </Box>
                                }
          />
        </Box>

        <Button 
          type='submit'
          variant='contained'
          size='large'
        >
          เบิกจ่าย
        </Button>
      </form>
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
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await serverFetch(context, '/info/options/disbursed');
  return {
    props: { options: res.data },
  };
};

export default disburse;