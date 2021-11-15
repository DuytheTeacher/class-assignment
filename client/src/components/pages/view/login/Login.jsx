import { useFormik } from 'formik';
import { useState } from 'react';
import styles from './Login.module.scss';

// UI Component
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

// Component
import Message from '../../../common/message/Message';

const Login = (props) => {
  const [message, setMessage] = useState(false);

  const toggleMessage = (value = { isDisplayed: false, content: '' }) => {
    setMessage(value);
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length > 50) {
      errors.username = 'Must be 50 characters or less';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length > 50) {
      errors.password = 'Must be 50 characters or less';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        setMessage({
          isDisplayed: true,
          content: 'Create new class successfully!',
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Grid container spacing={2} className={styles.Container}>
        <Grid xs={7}>
          <img
            className={styles.Background}
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1473&q=80"
            alt="login-background"
          />
        </Grid>
        <Grid item xs={5}>
          <h2 className={styles.Title}>
            Welcome to <span className={styles.Brand}>CLASSROOM</span>
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              type="text"
              color={formik.errors.username ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username ? (
              <div className={styles.errorMessage}>
                {formik.errors.username}
              </div>
            ) : null}
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="text"
              color={formik.errors.password ? 'error' : 'primary'}
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? (
              <div className={styles.errorMessage}>
                {formik.errors.password}
              </div>
            ) : null}
          </form>
          <div className={styles.ButtonGroup}>
            <div className={styles.Button}>
              <Button variant="contained" size="large" fullWidth>
                Login
              </Button>
            </div>
            <div className={styles.Button}>
              <Button variant="outlined" size="large" fullWidth>
                Register
              </Button>
            </div>
          </div>
          <Grid container spacing={2} className={styles.SocialLoginGroup}>
            <Grid item xs={4}>
              <Button
                className={styles.LoginWithGoogle}
                startIcon={<GoogleIcon />}
                fullWidth
                size="small"
              >
                Login with Google
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                className={styles.LoginWithFacebook}
                startIcon={<FacebookIcon />}
                fullWidth
                size="small"
              >
                Login with Facebook
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                className={styles.LoginWithGithub}
                startIcon={<GitHubIcon />}
                fullWidth
                size="small"
              >
                Login with Github
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Message toggleMessage={toggleMessage} message={message} />
    </>
  );
};

export default Login;
