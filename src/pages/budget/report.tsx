import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Typography } from '@mui/material'
import { Dayjs } from 'dayjs'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type Props = {}

interface IFormInput {
  startDate: Dayjs,
  endDate: Dayjs
}
const report = (props: Props) => {
  const axiosAuth = useAxiosAuth();
  const { handleSubmit, control, formState: { errors, }, reset  } = useForm<IFormInput>({})
  const onSubmit: SubmitHandler<IFormInput> = async(data) => {};
  return (
    <Layout>
      <Typography>รายงาน</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>

      </form>
    </Layout>
  )
}

export default report;