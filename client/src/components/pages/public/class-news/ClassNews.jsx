import styles from './ClassNews.module.scss';
import { useState } from 'react';

// UI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ClassNews = (props) => {
  const { classDetail } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.ClassNews}>
      <div className={styles.BackdropContainer} sx={{ boxShadow: 3 }}>
        <img
          className={styles.Backdrop}
          src={classDetail.backdrop}
          alt="backdrop"
        />
        <h1 className={styles.ClassName}>{classDetail.name}</h1>
      </div>
      <div className={styles.Content}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box
              sx={{ boxShadow: 3, borderRadius: 1 }}
              className={styles.InvitationBox}
            >
              <div className={styles.InvitationTop}>
                <span>Mã lớp học</span>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls="long-menu"
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
              </div>
              <div className={styles.InvitationBot}>
                  <span className={styles.Code}>{'hehe'}</span>
              </div>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ boxShadow: 3, borderRadius: 1 }}>xs=4</Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ boxShadow: 3, borderRadius: 1 }}>xs=4</Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ boxShadow: 3, borderRadius: 1 }}>xs=8</Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ClassNews;
