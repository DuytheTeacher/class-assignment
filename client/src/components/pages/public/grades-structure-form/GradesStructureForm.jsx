// Librabries
import { FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import styles from './GradesStructureForm.module.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// UI Components
import TextField from '@mui/material/TextField';
// Services
import ClassroomService from '../../../../services/classroom.service';
import { Grid } from '@mui/material';

const SortableItem = ({
  gradeTouched,
  gradeErrors,
  i,
  handleChange,
  handleBlur,
  grade,
}) => {
  return (
    <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
      {(provided, snapshot) => (
        <Grid
          container
          spacing={2}
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
          <Grid item xs={6}>
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
}) => {
  return (
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <Form className={styles.Form}>
            <FieldArray name="gradesList">
              {({ insert, remove, push }) =>
                gradesList.map((grade, index) => {
                  const gradeErrors =
                    (errors.gradesList?.length && errors.gradesList[index]) ||
                    {};
                  const gradeTouched =
                    (touched.gradesList?.length && touched.gradesList[index]) ||
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
  );
};

const GradesStructureForm = () => {
  const classID = window.location.pathname.split('/')[2];

  const [gradesList, setGradeList] = useState([]);

  useEffect(() => {
    const getGradeStructure = async () => {
      const resp = await ClassroomService.getGradeStructure(classID);
      resp.length
        ? setGradeList(resp)
        : setGradeList([
            { name: 'Midterm', maxScore: 0, ordinal: 0 },
            { name: 'Finalterm', maxScore: 0, ordinal: 1 },
          ]);
    };
    getGradeStructure();

    return () => {
      setGradeList([{ name: '', maxScore: 0, ordinal: 0 }]);
    };
  }, [classID]);

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
      gradesList,
      result.source.index,
      result.destination.index
    );

    setGradeList(newGradeList);
  };

  const onSubmit = (fields) => {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, values, touched, setValues, handleChange, handleBlur }) => {
          return (
            <FieldsArray
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              gradesList={gradesList}
            />
          );
        }}
      </Formik>
    </DragDropContext>
  );
};

export default GradesStructureForm;
