import { useState, useEffect } from 'react';
import styles from './Classes.module.scss';

// UI Components
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// Components
import { FormDialog } from '../../public';
import { ClassCard } from '../../public';
import { Message } from '../../../common';

// Services
import ClassroomService from '../../../../services/classroom.service';
// import UserService from '../../../../services/user.service';

const Classes = (props) => {
  const { isDialogOpened, handleOpenNewClassDialog } = props;
  const [classList, setClassList] = useState([]);
  const [message, setMessage] = useState({ isDisplayed: false, content: '' });
  const [backdrop, setBackdrop] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const resp = await ClassroomService.getListClassrooms();
      setClassList(resp.reverse());
      setBackdrop(false);
    };

    fetchClassrooms();
  }, []);

  const updateClassList = (data) => {
    setClassList(data);
  };

  const toggleMessage = (value = { isDisplayed: false, content: '' }) => {
    setMessage(value);
  };

  const toggleBackdrop = (value = false) => {
    setBackdrop(value);
  };

  return (
    <>
      {isDialogOpened && (
        <FormDialog
          isDialogOpened={isDialogOpened}
          handleOpenNewClassDialog={handleOpenNewClassDialog}
          toggleMessage={toggleMessage}
          toggleBackdrop={toggleBackdrop}
          updateClassList={updateClassList}
          classList={classList}
        />
      )}
      {classList.length ? (
        <Grid
          container
          sx={{ mx: 'auto' }}
          spacing={{ xs: 2, md: 3, lg: 4 }}
          columns={{ xs: 6, md: 6, lg: 5 }}
        >
          {classList.map((item, index) => (
            <Grid item sx={{ mt: 2 }} key={index}>
              <ClassCard classItem={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={styles.PlaceholderContainer}>
          <img
            className={styles.PlaceholderImage}
            src="/images/empty-placeholder.png"
            alt="empty-placeholder"
          />
          <Typography
            variant="h3"
            component="div"
            className={styles.PlaceholderText}
          >
            There is no Classroom! Let's create One!
          </Typography>
        </div>
      )}
      {/* Backdrop block */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Message block */}
      <Message toggleMessage={toggleMessage} message={message} />
    </>
  );
};

export default Classes;
