import { Layout } from '@/components/Layouts/Layout'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowsProp, GridRowModesModel, GridRowModes, GridColDef, GridToolbarContainer, GridActionsCellItem, GridEventListener, GridRowId, GridRowModel, GridRowEditStopReasons, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

type Props = {}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}


const list = (props: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const [ data, setData ] = useState();
  const axiosAuth = useAxiosAuth();
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 180},
    { field: 'itemcode', headerName: 'Itemcode', width: 180},
    { field: 'item', headerName: 'รายการ', width: 600},
    { field: 'psu_number', headerName: 'เลขที่ มอ.', width: 180},
    { field: 'amount', 
      headerName: 'จำนวนเงินที่เบิกจ่าย', 
      width: 180,
      renderCell: ({ value }) => Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    { field: 'date', 
      headerName: 'วันที่', 
      width: 180,
      renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
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
            onClick={ () => {} }
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
          slots={{
            toolbar: EditToolbar,
          }}
        />
      </Box>
    </Layout>
  )
}


export default list