import React from 'react'
import { styled, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import theme, { drawerWidth } from '@/lib/theme';


const openedMixin = (): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('mobile')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(),
      '& .MuiDrawer-paper': openedMixin(),
    }),
    ...(!open && {
      ...closedMixin(),
      '& .MuiDrawer-paper': closedMixin(),
    }),
  }),
);

interface MenuProps {
    open: boolean,
    onDrawerClose: () => void;
}

const routes = {
    ADMIN: [
      { label: "เบิกจ่าย", link: "/budget/disburse/", icon: <AttachMoneyIcon/> },
      { label: "รายการ", link: "/budget/list", icon: <FormatListBulletedIcon/> },
      { label: "Itemcode", link: "/budget/itemcode", icon: <AddIcon/> },
      { label: "รายงาน", link: "/budget/report", icon: <PrintIcon/> }
    ],

  }



const Menu = ( { open, onDrawerClose }: MenuProps ) => {
  const router = useRouter();
  return (
    <Drawer variant="permanent" open={open}>
    <DrawerHeader>
      <IconButton onClick={onDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </DrawerHeader>
    <Divider />
    <List>
      {routes.ADMIN.map( ( { icon, label, link } ) => (
        <ListItem key={label} disablePadding sx={{ display: 'block' }} onClick={ () => router.push(link)}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Divider />
  </Drawer>
  )
}

export default Menu