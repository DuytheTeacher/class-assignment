import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';


const ButtonAppBar = ({ handleOpenNewClassDialog }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark={true} color="transparent">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Classroom
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="add"
            sx={{ mr: 0 }}
          >
          <Tooltip title="Add new class">
            <AddIcon onClick={() => handleOpenNewClassDialog(true)}/>
          </Tooltip>
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;