import { Layout } from '@/components/Layouts/Layout'
import { NumericFormatCustom } from '@/components/Common/NumbericTextField';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { serverFetch } from '@/lib/serverFetch';
import { Autocomplete, Box, Button, TextField, Typography, Alert, AlertTitle, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  data : {
    fac_opt: any,
    product_opt: any,
    type_opt: any
  }
}

interface IFormInput {
  code: string;
  total_amount: string;
  name: string;
  fac : string;
  product: string;
  type: string;
}

const code = ( { data } : Props) => {
  const [selectedFac, setSelectedFac] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const axiosAuth = useAxiosAuth();
  const { handleSubmit, control, formState: { errors, }, reset } = useForm<IFormInput>({
    defaultValues : {
      code: '',
      total_amount: '',
      name: ''
     }
  })
  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    try {
      const res = await axiosAuth.post('/budget/additemcode', data);
      if ( res.status === 201 ) toast.success( "เพิ่มItemcodeสำเร็จ" );
      setSelectedFac(null); 
      setSelectedType(null);
      setSelectedProduct(null);
      reset();
    } catch (error : any) {
      const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <Typography variant='h2'>เพิ่มItemcode</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" marginBottom="15px">
          <Controller
            name='code'
            control={control}
            rules={ { required: 'กรุณากรอกItemcode' }}
            render={ ({field}) => <TextField 
                                    label='itemcode' 
                                    sx={{ marginRight: "10px" }}
                                    error={!!errors.code}
                                    helperText={errors.code?.message}
                                    {...field} 
                                  /> 
            }
          />
          <Controller
            name='total_amount'
            control={control}
            rules={ { required: 'กรุณากรอกจำนวนเงิน' }}
            render={({ field }) => <TextField label="จำนวนเงิน"
                                        sx={{ marginRight: "10px", width:"250px" }}
                                        InputProps={{ inputComponent: NumericFormatCustom as any, }}
                                        error={!!errors.total_amount}
                                        helperText={errors.total_amount?.message}
                                        {...field}
                                      />}
          />
        </Box>
        <Box display="flex" marginBottom="10px">
          <Controller
            name="name"
            control={control}
            rules={ { required: 'กรุณากรอกชื่อรายการ' }}
            render={ ({field}) => <TextField
                                    sx={{ width: "500px", marginRight: "10px" }}
                                    label='ชื่อรายการ'
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    {...field}
                                  />
            }
          />
        </Box>
        <Box display="flex" marginBottom="10px">
         <Controller
            name='fac'
            control={control}
            rules={ { required: 'กรุณาเลือกคณะ' }}
            render={({ field }) => {
              const { onChange, value, ref } = field;
              return (
                <Box sx={{ marginRight: "10px"}} width={315}>
                  <Autocomplete
                    value={selectedFac}
                    onChange={(event: any, newValue:any) => {
                        onChange(newValue ? newValue.id : null) 
                        setSelectedFac(newValue);
                      }}
                    options={ data.fac_opt }
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
              name="type"
              control={control}
              rules={ { required: 'กรุณาเลือกหมวดรายจ่าย'}}
              render={({ field }) => {
                const { onChange, value, ref } = field;
                return (
                  <Box sx={{ marginRight: "10px"}} width={175}>
                    <Autocomplete
                      value={selectedType}
                      onChange={(event: any, newValue:any) => {
                          onChange(newValue ? newValue.id : null) 
                          setSelectedType(newValue);
                        }}
                      options={ data.type_opt }
                      renderInput={ (params) => <TextField 
                                                  {...params} 
                                                  label= "เลือกหมวดรายจ่าย" 
                                                  error={!!errors.type}
                                                  helperText={errors.type?.message}
                                                /> 
                    }
                    />
                  </Box>
                );
              }}
          />
        </Box>

        <Box>
         <Controller
            name='product'
            control={control}
            rules={ { required: 'กรุณาเลือกผลิตภัณฑ์'}}
            render={({ field }) => {
              const { onChange, value, ref } = field;
              return (
                <Box sx={{ marginRight: "10px"}} width={500}>
                  <Autocomplete
                    value={selectedProduct}
                    onChange={(event: any, newValue:any) => {
                        onChange(newValue ? newValue.id : null) 
                        setSelectedProduct(newValue);
                      }}
                    options={ data.product_opt }
                    renderInput={ (params) => <TextField 
                                                {...params} 
                                                label= "เลือกผลิตภัณฑ์" 
                                                error={!!errors.product}
                                                helperText={errors.product?.message}
                                              /> 
                  }
                  />
                </Box>
              );
            }}
         />

        </Box>
        <Button
          variant='contained'
          sx={{ marginTop: "10px" }}
        >
            สร้าง
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
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const res = await serverFetch(context, `/info/options/add`);
    return {
        props: { data: res.data }
    };
};

export default code;