import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Card, CardContent, Divider, Menu, MenuItem } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { drawerWidth } from '@/lib/theme';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface HeaderProps {
  open: boolean,
  onDrawerOpen: () => void;
  user: User | undefined
}

const Header = ( {open, onDrawerOpen, user }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
      <AppBar position="fixed" color='primary' open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PSU-Budget {process.env.VERSION}
          </Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Typography variant="h6" noWrap component="div">{user?.firstname} {user?.lastname}</Typography>
          <Avatar style={{ marginLeft: '10px', marginRight: '15px' }} onClick={() => setMenuOpen(true)}>{user?.firstname.charAt(0)}{user?.lastname.charAt(0)}</Avatar>
        </Toolbar>
        <Menu 
          anchorEl={anchorEl}
          open={menuOpen} onClose={() => setMenuOpen(false)} 
          anchorOrigin={{
            vertical: "top",
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            marginLeft:"-30px",
            marginTop: 5 
          }}
        >
          <Box  sx={ { minWidth: 200, minHeight: 100  } } >
            <Box sx={{display:"flex", flexDirection:"column", marginLeft: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>{user?.firstname.charAt(0)}{user?.lastname.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{user?.username ?? ""}</Typography>
                </Box>
              </Box>
              <Typography variant="body1" gutterBottom>
                  {user?.firstname} {user?.lastname}
              </Typography>
            </Box>        
            <Divider/>
          </Box>
          <MenuItem onClick={async() => await signOut()}><LogoutOutlined/>Logout</MenuItem>
        </Menu>
      </AppBar>
  );
}

export default Header