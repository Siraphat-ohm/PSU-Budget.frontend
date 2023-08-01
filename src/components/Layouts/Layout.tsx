import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import Menu from './Menu';
import { useSession } from 'next-auth/react';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface LayoutProps {
    children: React.ReactNode
}

export const Layout = ( { children }: LayoutProps ) => {
    const [open, setOpen] = React.useState(false);
    const { data: session, status } = useSession();
    
    if (status === 'loading'){
      return <div>loading...</div>
    } 
    return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <Header open={open} onDrawerOpen={() => setOpen(true)} user={session?.user}/>
      <Menu open={open} onDrawerClose={() => setOpen(false)}/>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh" }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
} 