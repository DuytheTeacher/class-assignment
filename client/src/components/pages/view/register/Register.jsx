import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

// UI Components
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// Services
import UserService from '../../../../services/user.service';
import AuthService from '../../../../services/auth.service';
import TokenService from '../../../../services/token.service';

const Register = (props) => {
  const { toggleMessage, setUser } = props;

  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'Required';
    } else if (values.firstName.length > 50) {
      errors.firstName = 'Must be 50 characters or less';
    }
    if (!values.lastName) {
      errors.lastName = 'Required';
    } else if (values.lastName.length > 50) {
      errors.lastName = 'Must be 50 characters or less';
    }
    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length > 50) {
      errors.username = 'Must be 50 characters or less';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.username.password > 50) {
      errors.password = 'Must be 50 characters or less';
    }
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      userType: 0,
    },
    validate,
    onSubmit: async (values) => {
      try {
        await UserService.register(values);
        await AuthService.login(values);
        setUser(TokenService.getUser());
        toggleMessage({
          isDisplayed: true,
          content: 'Create new account successfully!',
          type: 'success',
        });
        navigate('/');
      } catch (error) {
        if (error.response.status === 400)
          toggleMessage({
            isDisplayed: true,
            content: 'Username is not available!',
            type: 'error',
          });
        else
          toggleMessage({
            isDisplayed: true,
            content: 'Something went wrong. Please check again!',
            type: 'error',
          });
      }
    },
  });

  return (
    <>
      <Grid container spacing={2} className={styles.Container}>
        <Grid item xs={7}>
          <h2 className={styles.Title}>
            Welcome to <span className={styles.Brand}>CLASSROOM</span>
          </h2>
          <form onSubmit={formik.handleSubmit} className={styles.FormGroup}>
            <Box
              sx={{
                '& .MuiTextField-root': { m: 1 },
              }}
              autoComplete="off"
            >
              <TextField
                autoFocus
                error={
                  formik.touched.firstName && formik.errors.firstName
                    ? true
                    : false
                }
                helperText={
                  formik.touched.firstName && (formik.errors.firstName || '')
                }
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              <TextField
                error={
                  formik.touched.lastName && formik.errors.lastName
                    ? true
                    : false
                }
                helperText={
                  formik.touched.lastName && (formik.errors.lastName || '')
                }
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              <TextField
                error={
                  formik.touched.username && formik.errors.username
                    ? true
                    : false
                }
                helperText={
                  formik.touched.username && (formik.errors.username || '')
                }
                margin="dense"
                id="username"
                label="Username"
                type="text"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              <TextField
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                helperText={
                  formik.touched.password && (formik.errors.password || '')
                }
                margin="dense"
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <TextField
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
                helperText={formik.touched.email && (formik.errors.email || '')}
                margin="dense"
                fullWidth
                id="email"
                label="Email"
                type="text"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <FormControlLabel
                control={
                  <Switch
                    id="userType"
                    checked={!!formik.values.userType}
                    onChange={(event) => {
                      formik.setFieldValue(
                        'userType',
                        event.target.checked ? 1 : 0
                      );
                    }}
                    value={!!formik.values.userType ? 'on' : 'off'}
                  />
                }
                label={`Register as a ${
                  formik.values.userType ? 'Teacher' : 'Student'
                }`}
              />
            </Box>
          </form>
          <div className={styles.ButtonGroup}>
            <div className={styles.Button}>
              <Button
                variant="outlined"
                size="large"
                onClick={formik.handleSubmit}
              >
                Register
              </Button>
            </div>
          </div>
        </Grid>
        <Grid xs={5}>
          <img
            className={styles.Background}
            src="https://images.unsplash.com/photo-1576506542790-51244b486a6b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"
            alt="login-background"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Register;
