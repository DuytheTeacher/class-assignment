// UI Components
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// Librabries
import TextField from '@mui/material/TextField';
import { FieldArray, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
// Store
import { setGradesList } from 'store/actions';
import * as Yup from 'yup';
import styles from './GradesStructureForm.module.scss';
// Services
import ClassroomService from 'services/classroom.service';

const SortableItem = ({
  gradeTouched,
  gradeErrors,
  i,
  handleChange,
  handleBlur,
  grade,
  remove,
  push,
  values,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const classID = window.location.pathname.split('/')[2];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemove = async () => {
    await deleteSingleLine();
    remove(i);
    handleClose();
  };
  const handlePush = () => {
    push({ name: 'Midterm', maxScore: 0, ordinal: values.gradesList.length, isNew: true });
    handleClose();
  };
  const saveSingleLine = async () => {
    if (grade.isNew) {
      delete grade.isNew;
      await ClassroomService.createGradeStructure(classID, [grade]);
    }
  };
  const deleteSingleLine = async () => {
    if (grade.isNew)
      delete grade.isNew;
    await ClassroomService.deleteGradeStructure(classID, [grade]);
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
          <Grid item xs={3}>
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
            {/* Hidden field for ID */}
            <TextField
              sx={{ display: 'none' }}
              id="_id"
              type="string"
              name={`gradesList.${i}._id`}
              value={grade._id || ''}
            />
            {/* Hidden field for New flag */}
            <TextField
              sx={{ display: 'none' }}
              id="isNew"
              type="boolean"
              name={`gradesList.${i}.isNew`}
              value={grade.isNew || ''}
            />
          </Grid>
          <Grid className={styles.SaveButton} item xs={2}>
            <Button
              sx={{ display: grade.isNew ? 'block' : 'none' }}
              variant="contained"
              disabled={!gradeTouched.maxScore && !gradeTouched.name}
              onClick={saveSingleLine}
            >
              Save
            </Button>
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
              {values.gradesList.length > 1 && (
                <MenuItem onClick={handleRemove}>Remove this Grade</MenuItem>
              )}
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
  handleSubmit,
}) => {
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
      values.gradesList,
      result.source.index,
      result.destination.index
    );

    values.gradesList = newGradeList;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Form className={styles.Form} onSubmit={() => handleSubmit()}>
              <FieldArray name="gradesList">
                {(arrayHelpers) =>
                  values.gradesList.map((grade, index) => {
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
                          remove={arrayHelpers.remove}
                          push={arrayHelpers.push}
                          values={values}
                        />
                      </div>
                    );
                  })
                }
              </FieldArray>
            </Form>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const GradesStructureForm = (props) => {
  const { gradesList, setGradesList, bindFormSubmit } = props;

  const initialValues = {
    gradesList: gradesList.length
      ? gradesList
      : [{ name: 'Midterm', maxScore: 0, ordinal: 0, _id: '' }],
  };

  const validationSchema = Yup.object().shape({
    gradesList: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        maxScore: Yup.number().required('Score is required'),
      })
    ),
  });

  const onSubmit = async (fields) => {
    const classID = window.location.pathname.split('/')[2];
    const isUpdate = gradesList.length;
    const reoderedGradesList = fields.gradesList.map((item, index) => ({
      name: item.name,
      maxScore: item.maxScore,
      ordinal: index,
      _id: isUpdate ? item._id : undefined,
    }));

    if (!isUpdate)
      await ClassroomService.createGradeStructure(classID, reoderedGradesList);
    else
      await ClassroomService.updateGradeStructure(classID, reoderedGradesList);
    setGradesList(fields.gradesList);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        errors,
        values,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        submitForm,
      }) => {
        bindFormSubmit(submitForm);
        return (
          <FieldsArray
            errors={errors}
            values={values}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
          />
        );
      }}
    </Formik>
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
