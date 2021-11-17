// UI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

// Services
import AuthService from '../../../services/auth.service';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ButtonAppBar = (props) => {
  const { user, setUser, handleOpenNewClassDialog } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogout = () => {
    AuthService.logout();
    setUser({});
    navigate('login');
    window.location.reload();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark={true} color="transparent">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#1976D2' }}>
            <Link to="/">Classroom</Link>
          </Typography>
          {!user ? (
            <Button color="inherit">
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <>
              {user.user_type && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="add"
                  sx={{ mr: 0 }}
                >
                  <Tooltip title="Add new class">
                    <AddIcon onClick={() => handleOpenNewClassDialog(true)} />
                  </Tooltip>
                </IconButton>
              )}
              <Typography
                variant="h6"
                component="div"
                sx={{ mr : 2 }}
              >{`${user.first_name} ${user.last_name}`}</Typography>
              <Avatar
                alt="Remy Sharp"
                src={user.avatar}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
              />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ButtonAppBar;
