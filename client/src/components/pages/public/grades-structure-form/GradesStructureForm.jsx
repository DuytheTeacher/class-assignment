// Librabries
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// UI Components
import TextField from '@mui/material/TextField';
import { FieldArray, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import styles from './GradesStructureForm.module.scss';
// Store
import { setGradesList } from 'store/actions';

const SortableItem = ({
  gradeTouched,
  gradeErrors,
  i,
  handleChange,
  handleBlur,
  grade,
  remove,
  push,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemove = () => {
    remove(i);
    handleClose();
  };
  const handlePush = () => {
    push({ name: 'Midterm', maxScore: 0, ordinal: 0 });
    handleClose();
  };
  return (
    <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
      {(provided) => (
        <Grid
          container
          spacing={4}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Grid item xs={6}>
            <TextField
              autoFocus={i === 0}
              fullWidth
              error={gradeTouched.name && gradeErrors.name ? true : false}
              helperText={gradeTouched.name && (gradeErrors.name || '')}
              margin="dense"
              id="name"
              label="Grade name (*)"
              type="text"
              variant="outlined"
              name={`gradesList.${i}.name`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={grade.name}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              error={
                gradeTouched.maxScore && gradeErrors.maxScore ? true : false
              }
              helperText={gradeTouched.maxScore && (gradeErrors.maxScore || '')}
              margin="dense"
              id="maxScore"
              label="Score (*)"
              type="number"
              variant="outlined"
              name={`gradesList.${i}.maxScore`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={grade.maxScore}
            />
          </Grid>
          <Grid item xs={1} className={styles.MenuIcon}>
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
              <MenuItem onClick={handlePush}>Create a new Grade</MenuItem>
              <MenuItem onClick={handleRemove}>Remove this Grade</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      )}
    </Draggable>
  );
};

const FieldsArray = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  gradesList,
  handleSubmit
}) => {
  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <Form className={styles.Form} onSubmit={handleSubmit}>
            <FieldArray name="gradesList">
              {({ insert, remove, push }) =>
                gradesList.map(
                  (grade, index) => {
                    const gradeErrors =
                      (errors.gradesList?.length && errors.gradesList[index]) ||
                      {};
                    const gradeTouched =
                      (touched.gradesList?.length &&
                        touched.gradesList[index]) ||
                      {};
                    return (
                      <div key={index}>
                        <SortableItem
                          gradeTouched={gradeTouched}
                          gradeErrors={gradeErrors}
                          i={index}
                          index={index}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          grade={grade}
                          remove={remove}
                          push={push}
                        />
                      </div>
                    );
                  }
                )
              }
            </FieldArray>
          </Form>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const GradesStructureForm = (props) => {
  const { gradesList, bindFormSubmit } = props;
  const [tempList, setTempList] = useState(gradesList);

  const initialValues = {
    gradesList: gradesList,
  };

  const validationSchema = Yup.object().shape({
    gradesList: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        maxScore: Yup.number().required('Score is required'),
      })
    ),
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newGradeList = reorder(
      tempList,
      result.source.index,
      result.destination.index
    );

    setTempList(newGradeList);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ errors, values, touched, handleChange, handleBlur, handleSubmit, submitForm }) => {
          bindFormSubmit(submitForm);
          return (
            <FieldsArray
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              gradesList={tempList}
              handleSubmit={handleSubmit}
            />
          );
        }}
      </Formik>
    </DragDropContext>
  );
};

const mapStateToProps = (state) => ({
  gradesList: state.class.gradesList,
});

const mapDispatchToProps = (dispatch) => ({
  setGradesList: (gradesList) => dispatch(setGradesList(gradesList)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GradesStructureForm);
