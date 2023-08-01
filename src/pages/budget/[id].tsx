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
        itemcode: string,
        item: string
        psu_number: string,
        dis_amount: string,
        amount:string,
        date: Dayjs 
    }
}

interface IFormInput {
  code: string;
  PSU_number: string;
  amount: string;
  date: Dayjs | null;
}

const Edit = ({ data }: Props) => {
    
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const { handleSubmit, control, formState: { errors, },  } = useForm<IFormInput>({
    defaultValues : {
      code: data.itemcode,
      PSU_number: data.psu_number,
      amount: data.amount,
      date: dayjs(data.date),
    }
  })
  const [ open, setOpen ] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const onSubmit: SubmitHandler<IFormInput> = async(value) => {
    const res = await axiosAuth.put("/budget/disburse", { ...value, oldAmount: data.amount, id: router.query.id });
    console.log(res.data);
  };

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
                                text={data?.itemcode || ''} 
                                sx={{ width: 220 }}
          />
        </Box>

        <Box width={550} marginBottom="15px">
          <ReadOnlyTextField 
            label='รายการ' 
            text={data?.item || ''} 
          />
        </Box>

        <Box marginBottom="15px" display="flex">
          <NumbericTextField 
            label='เงินคงเหลือ' 
            value={ data.dis_amount || ''} 
            readonly 
          />
          <Controller
            name="PSU_number"
            control={control}
            rules={{ required: 'กรุณากรอกเลขที่ มอ.' }}
            render={({ field }) => <TextField 
                                      sx={{ width: "290px" }} 
                                      label="เลขที่ มอ."
                                      error={!!errors.PSU_number}
                                      helperText={errors.PSU_number?.message}
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
          บันทึก
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle >
                Confirm
            </DialogTitle>
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
                onClick={handleClose} 
                autoFocus
                variant='outlined'
                color='success'
            >
                ยืนยัน
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
