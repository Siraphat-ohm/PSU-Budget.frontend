import { useState } from 'react';
import {  Alert, AlertTitle, Autocomplete, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { serverFetch } from '@/lib/serverFetch';
import { Layout } from '@/components/Layouts/Layout';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumbericTextField, NumericFormatCustom } from '@/components/NumbericTextField';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { ReadOnlyTextField } from '@/components/ReadOnlyField';

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
}

interface ICode {
  name: string;
  balance: string;
  label: string;
}

const Disburse = ({ options }: Props) => {
  const axiosAuth = useAxiosAuth();
  const { handleSubmit, control, formState: { errors, }, reset  } = useForm<IFormInput>({
    defaultValues : {
      psu_code: "",
      amount: "",
      date: dayjs()
    }
  })
  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    try {
      await axiosAuth.post('/budget/disburse', data);
      setSuccess(true)
      reset()
    } catch (error) {
      console.log(error);
      setAlert(true);
    }
  };

  const [ fac, setFac ] = useState<string | null>();
  const [ code, setCode ] = useState<ICode>();
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ alert, setAlert ] = useState<boolean>(false);

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
                  const { onChange, value, ref } = field;
                  return (
                    <Box sx={{ marginRight: "10px"}} width={320}>
                      <Autocomplete
                        onChange={(event: any, newValue) => {
                            onChange(newValue ? newValue.id : null) 
                            setFac(newValue?.id)
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
                  const { onChange, value, ref } = field;
                  return (
                    <Box width={220}>
                      <Autocomplete
                        onChange={(event: any, newValue: any) => {
                            onChange(newValue ? newValue.label : null);
                            setCode(newValue);
                          }}
                        options={ fac ? options.code_opt[fac] : [] }
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

        <Button 
          type='submit'
          variant='contained'
          size='large'
        >
          เบิกจ่าย
        </Button>
      </form>
      <Snackbar open={alert} autoHideDuration={2500} onClose={ () => setAlert(false)}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          เบิกจ่ายไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={2500} onClose={ () => setSuccess(false) }>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          เบิกจ่ายสำเร็จ
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await serverFetch(context, '/info/options/disbursed');

  return {
    props: { options: res.data },
  };
};

export default Disburse;