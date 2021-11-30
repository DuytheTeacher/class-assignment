// Librabries
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
// UI Components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useRef } from 'react';
// Components
import { GradesStructureForm } from '..';
// Services
import ClassroomService from 'services/classroom.service';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = (props) => {
  const { notifyOpenDialog, isOpenDialog } = props;
  const classID = window.location.pathname.split('/')[2];
  let submitFormGradesList;

  const bindFormSubmit = (formSubmit) => {
    submitFormGradesList = formSubmit;
  };

  const onSubmitGradesList = async (newGradesList) => {
    try {
      // await ClassroomService.createGradeStructure(classID, newGradesList);
      submitFormGradesList();
      notifyOpenDialog(false);
    } catch (error) {
      throw error;
    }
  };

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
              onClick={onSubmitGradesList}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <GradesStructureForm bindFormSubmit={bindFormSubmit} />
      </Dialog>
    </div>
  );
};
export default FullScreenDialog;
