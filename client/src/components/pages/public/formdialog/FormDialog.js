import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { classes as classAPI } from '../../../utils/api';
import styles from './FormDialog.module.scss';



const FormDialog = (props) => {
  const { isDialogOpened, handleOpenNewClassDialog, toggleMessage, toggleBackdrop, updateClassList } = props;

  const handleClose = () => {
    handleOpenNewClassDialog(false);
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length > 50) {
      errors.name = 'Must be 50 characters or less';
    }
    if (values.lesson.length > 50) {
      errors.lesson = 'Must be 50 characters or less';
    }
    if (values.topic.length > 50) {
      errors.topic = 'Must be 50 characters or less';
    }
    if (values.room.length > 50) {
      errors.room = 'Must be 50 characters or less';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      lesson: '',
      topic: '',
      room: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        handleOpenNewClassDialog(false);
        toggleBackdrop(true);
        await classAPI.createClass(values);
        const responseClasses = await classAPI.getClasses();
        updateClassList(responseClasses.data.classes);
        toggleBackdrop(false);
        toggleMessage({ isDisplayed: true, content: 'Create new class successfully!' });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Dialog open={isDialogOpened} onClose={handleClose}>
        <DialogTitle>Add new class</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Class name (*)"
              type="text"
              color={formik.errors.name ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? <div className={styles.errorMessage}>{formik.errors.name}</div> : null}
            <TextField
              margin="dense"
              id="lesson"
              label="Lesson"
              type="text"
              color={formik.errors.lesson ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.lesson}
            />
            {formik.errors.lesson ? <div className={styles.errorMessage}>{formik.errors.lesson}</div> : null}
            <TextField
              margin="dense"
              id="topic"
              label="Topic"
              type="text"
              color={formik.errors.topic ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.topic}
            />
            {formik.errors.topic ? <div className={styles.errorMessage}>{formik.errors.topic}</div> : null}
            <TextField
              margin="dense"
              id="room"
              label="Room"
              type="text"
              color={formik.errors.room ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.room}
            />
            {formik.errors.room ? <div className={styles.errorMessage}>{formik.errors.room}</div> : null}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={formik.handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormDialog;
