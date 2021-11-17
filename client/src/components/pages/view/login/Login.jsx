import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

// UI Components
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

// Components

// Services
import AuthService from "../../../../services/auth.service";

const Login = (props) => {
  const { toggleMessage, setUser } = props;

  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
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
        await AuthService.login(values);
        setUser(JSON.parse(localStorage.getItem('user')));
        toggleMessage({
          isDisplayed: true,
          content: 'Login successfully!',
          type: 'success'
        });
        navigate('/');
      } catch (error) {
        toggleMessage({
          isDisplayed: true,
          content: 'Username or password is incorrect!',
          type: 'error'
        });
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
              error={formik.touched.username && formik.errors.username ? true : false}
              helperText={formik.touched.username && (formik.errors.username || '')}
              margin="dense"
              id="username"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            <TextField
              error={formik.touched.password && formik.errors.password ? true : false}
              helperText={formik.touched.password && (formik.errors.password || '')}
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </form>
          <div className={styles.ButtonGroup}>
            <div className={styles.Button}>
              <Button variant="contained" size="large" fullWidth onClick={formik.handleSubmit}>
                Login
              </Button>
            </div>
            <div className={styles.Button}>
              <Button variant="outlined" size="large" fullWidth>
                <Link to="/register">Register</Link>
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
    </>
  );
};

export default Login;
