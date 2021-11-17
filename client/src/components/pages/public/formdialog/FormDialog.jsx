import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';

// Services
import ClassroomService from '../../../../services/classroom.service';

const FormDialog = (props) => {
  const { isDialogOpened, handleOpenNewClassDialog, toggleMessage, toggleBackdrop, updateClassList, classList } = props;

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
    if (!values.description) {
      errors.description = 'Required';
    } else if (values.description.length > 50) {
      errors.description = 'Must be 50 characters or less';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        handleOpenNewClassDialog(false);
        toggleBackdrop(true);
        const responseClass = await ClassroomService.createClass(values);
        updateClassList([responseClass.data.payload, ...classList]);
        toggleBackdrop(false);
        toggleMessage({ isDisplayed: true, content: 'Create new class successfully!', type: 'success' });
      } catch (error) {
        toggleBackdrop(false);
        toggleMessage({ isDisplayed: true, content: 'Class name is unavailable!', type: 'error' });
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
              error={formik.touched.name && formik.errors.name ? true : false}
              helperText={formik.touched.name && (formik.errors.name || '')}
              margin="dense"
              id="name"
              label="Class name (*)"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            <TextField
              error={formik.touched.description && formik.errors.description ? true : false}
              helperText={formik.touched.description && (formik.errors.description || '')}
              margin="dense"
              id="description"
              label="Description (*)"
              type="text"
              fullWidth
              multiline
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
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
