import MoreVertIcon from '@mui/icons-material/MoreVert';
// UI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';
import { GradesStructure } from '..';
// Services
import ClassroomService from 'services/classroom.service';
import styles from './ClassNews.module.scss';
// Store
import { setGradesList } from 'store/actions';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ClassNews = (props) => {
  const { classDetail, gradesList, setGradesList } = props;
  const classID = window.location.pathname.split('/')[2];

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const getGradeStructure = useCallback(
    async () => {
      const resp = await ClassroomService.getGradeStructure(classID);
      if (resp.length)
        setGradesList(resp);
    },
    [classID, setGradesList]
  );

  useEffect(() => {
    getGradeStructure();
  }, [getGradeStructure]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifyOpenDialog = (value) => {
    setIsOpenDialog(value);
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
                <span className={styles.InvitationText}>Class code</span>
                <span>{classDetail._id?.substr(0, 6)}</span>
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
                  <MenuItem onClick={handleClose}>Re-GenerateCode</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
              </div>
              <div className={styles.InvitationBot}>
                <span className={styles.Code}>{}</span>
              </div>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ boxShadow: 3, borderRadius: 1 }}>xs=4</Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{ boxShadow: 3, borderRadius: 1 }}
              className={styles.GradeStuctureBox}
            >
              <span className={styles.GradeTitleText}>Grades Structure</span>
              <Button variant="text" className={styles.EditButton} onClick={() => notifyOpenDialog(true)}>Edit</Button>
              <GradesStructure notifyOpenDialog={notifyOpenDialog} isOpenDialog={isOpenDialog} />
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {gradesList.map((grade) => {
                  return (
                    <React.Fragment key={grade.ordinal}>
                      <Grid item xs={6}>
                        <Item>{grade.name}</Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item>{grade.maxScore}</Item>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ boxShadow: 3, borderRadius: 1 }}>xs=8</Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gradesList: state.class.gradesList
});

const mapDispatchToProps = (dispatch) => ({
  setGradesList: (gradesList) => dispatch(setGradesList(gradesList))
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassNews);
