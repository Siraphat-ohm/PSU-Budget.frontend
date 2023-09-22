import React, { useState } from 'react'
import {  Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { serverFetch } from '@/lib/serverFetch';
import { Layout } from '@/components/Layouts/Layout';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumbericTextField, NumericFormatCustom } from '@/components/NumbericTextField';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { ReadOnlyTextField } from '@/components/ReadOnlyField';
import { useRouter } from 'next/router';

interface Props {
    data: {
        id: string,
        fac: string,
        code: string,
        name: string,
        psu_code: string,
        withdrawal_amount: string,
        balance:string,
        date: Dayjs 
    }
}

interface IFormInput {
  code: string;
  psu_code: string;
  amount: string;
  date: Dayjs | null;
}

const Edit = ({ data }: Props) => {
    
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const [ error, setError ] = useState<string>('');
  console.log(data.date);
  const { handleSubmit, control, formState: { errors, },  } = useForm<IFormInput>({
    defaultValues : {
      code: data.code,
      psu_code: data.psu_code,
      amount: data.withdrawal_amount,
      date: dayjs(data.date),
    }
  });
  const [ open, setOpen ] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const onSubmit: SubmitHandler<IFormInput> = async(values) => {
    values.date = dayjs(values.date).add(1, 'day')
    try {
      const res = await axiosAuth.put("/budget/disburse", { id: router.query.id, ...values, oldAmount: data.withdrawal_amount, });
      console.log(res);
    } catch ( error : any ) {
      setError(error.response.data.error);
    }
  };

  const handleSubmitDialog = () => {
    handleSubmit(onSubmit)();
    handleClose();
  }

  return (
    <Layout>
      <Typography variant="h2">แก้ไขข้อมูลเบิกจ่าย</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" marginBottom="15px">
          <ReadOnlyTextField 
            label='คณะ' 
            text={data?.fac || ''} 
            sx={{ width: 315, marginRight: "15px" }} 
            />
          <ReadOnlyTextField
                                label='itemcode' 
                                text={data?.code || ''} 
                                sx={{ width: 220 }}
          />
        </Box>
        <Box width={550} marginBottom="15px">
          <ReadOnlyTextField 
            label='รายการ' 
            text={data?.name || ''} 
          />
        </Box>
        <Box marginBottom="15px" display="flex">
          <NumbericTextField 
            label='เงินคงเหลือ' 
            value={ data.balance || ''} 
            readonly 
          />
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
          variant='contained'
          size='large'
          onClick={() => handleOpen()}
        >
          บันทึก
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
          <DialogTitle > Confirm </DialogTitle>
            <DialogContent>
              <DialogContentText>
                  ต้องการแก้ไขข้อมูล
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                  onClick={handleClose}
                  color='error'
                  variant='outlined'
              >
                  ยกเลิก
              </Button>
              <Button 
                  type='submit'
                  onClick={() => handleSubmitDialog()} 
                  autoFocus
                  variant='outlined'
                  color='success'
              >
                  ยืนยัน
              </Button>
            </DialogActions>
        </Dialog>
        <Dialog
          open={!!error}
        >
          <DialogTitle color="red"> Error </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {error}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                  type='submit'
                  onClick={() => setError('')} 
                  autoFocus
                  variant='contained'
                  color='error'
              >
                  ตกลง
              </Button>
            </DialogActions>
        </Dialog>
      </form>
    </Layout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query;
    const res = await serverFetch(context, `/info/${id}`);
    return {
        props: { data: res.data }
    };
};

export default Edit;