// Librabries
import { FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import styles from './GradesStructureForm.module.scss';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
// UI Components
import TextField from '@mui/material/TextField';
// Services
import ClassroomService from '../../../../services/classroom.service';
import { Grid } from '@mui/material';

const SortableItem = sortableElement(
  ({ gradeTouched, gradeErrors, i, handleChange, handleBlur, grade }) => {
    return (
      <Grid container spacing={2}>
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
            error={gradeTouched.maxScore && gradeErrors.maxScore ? true : false}
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
    )
  }
);

const SortableContainer = sortableContainer(
  ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
      <Form className={styles.Form}>
        <FieldArray name="gradesList">
          {({ insert, remove, push }) =>
          values.gradesList.map((grade, index) => {
              const gradeErrors =
                (errors.gradesList?.length && errors.gradesList[index]) || {};
              const gradeTouched =
                (touched.gradesList?.length && touched.gradesList[index]) || {};
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
    );
  }
);

const GradesStructureForm = () => {
  const classID = window.location.pathname.split('/')[2];

  const [gradesList, setGradeList] = useState([]);

  useEffect(() => {
    const getGradeStructure = async () => {
      const resp = await ClassroomService.getGradeStructure(classID);
      setGradeList(resp);
    };
    getGradeStructure();

    return () => {
      setGradeList([{ name: '', maxScore: 0, ordinal: 0 }]);
    };
  }, [classID]);

  const initialValues = {
    gradesList: gradesList.length
      ? gradesList
      : [
          { name: 'Midterm', maxScore: 0, ordinal: 0 },
          { name: 'Finalterm', maxScore: 0, ordinal: 1 },
        ],
  };

  const validationSchema = Yup.object().shape({
    gradesList: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        maxScore: Yup.number().required('Score is required'),
      })
    ),
  });

  const onSubmit = (fields) => {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    [initialValues.gradesList[oldIndex], initialValues.gradesList[newIndex]] = [initialValues.gradesList[newIndex], initialValues.gradesList[oldIndex]];
    setGradeList(() => ({
      gradesList: initialValues.gradesList,
    }));
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ errors, values, touched, setValues, handleChange, handleBlur }) => {
        return (
          <SortableContainer
            errors={errors}
            values={values}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            onSortEnd={onSortEnd}
          />
        );
      }}
    </Formik>
  );
};

export default GradesStructureForm;
