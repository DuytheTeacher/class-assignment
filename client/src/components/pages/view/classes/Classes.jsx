import Grid from '@mui/material/Grid';
import { FormDialog } from '../../public';
import ClassCard from '../../public/card/ClassCard';
import Message from '../../../common/message/Message';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState,useEffect } from 'react';

// API
import { classes as classAPI } from '../../../utils/api';

const Classes = (props) => {
  const { isDialogOpened, handleOpenNewClassDialog } = props;
  const [ classList, setClassList ] = useState([]);
  const [ message, setMessage ] = useState({ isDisplayed: false, content: '' });
  const [ backdrop, setBackdrop ] = useState(true);

  useEffect(() => {
    classAPI.getClasses().then((resp) => {
      setClassList(resp.reverse());
      setBackdrop(false);
    });
  }, []);

  const updateClassList = (data) => {
    setClassList(data);
  }

  const toggleMessage = (value = { isDisplayed: false, content: '' }) => {
    setMessage(value);
  }

  const toggleBackdrop = (value = false) => {
    setBackdrop(value);
  }

  return (
    <>
      {isDialogOpened && (
        <FormDialog
          isDialogOpened={isDialogOpened}
          handleOpenNewClassDialog={handleOpenNewClassDialog}
          toggleMessage={toggleMessage}
          toggleBackdrop={toggleBackdrop}
          updateClassList={updateClassList}
        />
      )}
      <Grid
        container
        sx={{ mx: 'auto' }}
        spacing={{ xs: 2, md: 3, lg: 4 }}
        columns={{ xs: 6, md: 6, lg: 5 }}
      >
        {classList.map((item, index) => (
          <Grid
            item
            sx={{ mt: 2 }}
            key={index}
          >
            <ClassCard classItem={item} />
          </Grid>
        ))}
      </Grid>
      {/* Backdrop block */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Message block */}
      <Message toggleMessage={toggleMessage} message={message}/>
    </>
  );
};

export default Classes;
