import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowsProp, GridRowModesModel, GridColDef, GridToolbarContainer, GridActionsCellItem, DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import toast, { Toaster } from "react-hot-toast"

interface Props {}

interface IList {
  id: number,
  code: string,
  name:string,
  psu_code: string,
  withdrawal_amount: string,
  date: string,
  note: string
}

const List = (props: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const [ data, setData ] = useState<IList[]>();
  const axiosAuth = useAxiosAuth();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ id, setId ] = useState<string | number>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = async() => {
    try {
      await axiosAuth.delete(`/budget/${id}`)
      setData( (prev : IList[] | undefined) => {
        return prev?.filter( item => item.id != id);
      })
      handleClose();
    } catch (error:any) {
      const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
      toast.error( errorMessage );
    }
  }
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 70},
    { field: 'code', headerName: 'Itemcode', width: 180},
    { field: 'name', headerName: 'รายการ', width: 735},
    { field: 'psu_code', headerName: 'เลขที่ มอ.', width: 170},
    { field: 'withdrawal_amount', 
      headerName: 'จำนวนเงินที่เบิกจ่าย', 
      width: 180,
      renderCell: ({ value }) => Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    { field: 'date', 
      headerName: 'วันที่', 
      width: 120,
      renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      field: 'note',
      headerName: 'หมายเหตุ',
      width: 250
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      align:"center",
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={ () => router.push(`/budget/${id}`)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={ () => {
              setId(id);
              handleOpen();
            } }
            color="inherit"
          />,
        ];
      },
    },
  ];
  useEffect(() => {
    const fetchData = async() => {
      const res = await axiosAuth.get('/info/items-disbursed');
      setData(res.data);
    }
    if (status === 'authenticated'){
      fetchData();
    }
  }, [status])

  if ( status === 'loading' ) {
    return (
      <Layout>
        Loading...
      </Layout>
    )
  }
  
  return (
    <Layout>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          sx={{ height: 800 }}
          rows={data ?? []}
          columns={columns}
          showCellVerticalBorder
          showColumnVerticalBorder
        />
      </Box>
      <Dialog
          open={open}
          onClose={ () => handleClose()}
      >
        <DialogTitle > Confirm </DialogTitle>
          <DialogContent>
            <DialogContentText>
                ต้องการลบรายการ
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
                onClick={() => handleClose()}
                color='error'
                variant='outlined'
            >
                ยกเลิก
            </Button>
            <Button 
                onClick={() => handleDelete()} 
                autoFocus
                variant='outlined'
                color='success'
            >
                ยืนยัน
            </Button>
          </DialogActions>
      </Dialog>
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

export default List;