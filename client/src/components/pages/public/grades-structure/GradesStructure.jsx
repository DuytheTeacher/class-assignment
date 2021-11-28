// Librabries
import React from 'react';
// UI Components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { GradesStructureForm } from '..';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = (props) => {
  const { notifyOpenDialog, isOpenDialog } = props;

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpenDialog}
        onClose={() => notifyOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} color="transparent">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => notifyOpenDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Grades Structure
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => notifyOpenDialog(false)}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <GradesStructureForm />
      </Dialog>
    </div>
  );
};
export default FullScreenDialog;
