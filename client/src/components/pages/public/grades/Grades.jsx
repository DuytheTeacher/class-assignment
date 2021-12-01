import { Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

export const Grades = (props) => {
  return <div>
    <Typography variant="h4">Grades Table</Typography>
  </div>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Grades);
