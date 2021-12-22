import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import styles from './Grades.module.scss';
import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import FormData from 'form-data';

import ScoreService from 'services/score.service';
import ClassroomService from 'services/classroom.service';

const renderRating = (params) => {
  // return <GradeInput value={params.value} />;
  return <div>
    {params.value}
  </div>
}

const GradeInput = (props) => {
  const { value, onChange } = props;

  return <div>
    <TextField id="outlined-basic" label="Score" type="number" variant="standard" defaultValue={value} onChange={onChange}/>
  </div>
};

const RatingEditInputCell = (props) => {
  const { id, value, api, field } = props;

  const [query, setQuery] = useState(value);
  const [displayMessage, setDisplayMessage] = useState(value);

  useEffect(() => {
    const timeOutId = setTimeout(() => setDisplayMessage(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  const handleChange = async (event) => {
    setQuery(event.target.value);
    await api.setEditCellValue(
      { id, field, value: Number(displayMessage) },
      event
    );

    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      await api.commitCellChange({ id, field });
    }
  };

  return (
    <div>
      <GradeInput
        value={displayMessage}
        onChange={handleChange}
      />
    </div>
  );
}

const renderRatingEditInputCell = (params) => {
  return <RatingEditInputCell {...params} />;
}

export const Grades = (props) => {
  const { gradesList, studentFromExcel } = props;
  const classID = window.location.pathname.split('/')[2];

  const [ rows, setRows ] = useState(studentFromExcel.map(item => {
    const newItem = { ...item, id: item._id };
    delete item._id;
    return newItem;
  }));
  const [ scores, setScores ] = useState([]);

  const columns = () => {
    const scoreCols = gradesList.map((col) => ({
      field: col.name,
      headerName: col.name,
      renderCell: renderRating,
      renderEditCell: renderRatingEditInputCell,
      editable: true,
      width: 180,
      type: 'number',
    }));

    return [
      {
        field: 'student_id',
        headerName: 'ID',
        width: 120
      },
      {
        field: 'full_name',
        headerName: 'Name',
        width: 200
      },
      ...scoreCols
    ]
  };

  const mappingScores = async (studentList) => {
    const mappedStudentList = studentList.map(async (item) => {
      const resp = await ScoreService.getListScore(classID, item._id);
      console.log(resp);
    });

    return mappedStudentList;
  };

  const onFileChange = async (e) => {
    const uploadedFile = e.target.files;
    let bodyFormData = new FormData();
    bodyFormData.append('file', uploadedFile[0]);
    bodyFormData.append('classId', classID);

    await ClassroomService.uploadListStudent(bodyFormData);
    const resp = await ClassroomService.getClassDetail(classID);
    mappingScores(rows);
    setRows(resp.list_students_from_xlsx.map(item => {
      const newItem = { ...item, id: item._id };
      delete item._id;
      return newItem;
    }));
  };

  return (
    <div className={styles.Grades}>
      <Typography variant="h4" gutterBottom>
        Grades Table
      </Typography>
      <Stack direction="row" spacing={2} marginBottom={2}>
        <Button variant="outlined">
          <input type="file" onChange={onFileChange} />
          <p>Upload student list</p>
        </Button>
        <Button variant="outlined">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://classroom-midterm.herokuapp.com/api/classrooms/download_file_template_list_students?classId=${classID}`}
          >
            Download student template
          </a>
        </Button>
        <Button variant="outlined">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://classroom-midterm.herokuapp.com/api/scores/download_file_template_list_scores_of_students?classId=${classID}`}
          >
            Download score template
          </a>
        </Button>
      </Stack>
      <div style={{ height: 250, width: '100%' }}>
        <DataGrid rows={rows} columns={columns()} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gradesList: state.class.gradesList
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Grades);
