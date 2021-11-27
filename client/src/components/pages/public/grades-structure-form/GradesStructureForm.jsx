import { FieldArray, Form, Formik } from 'formik';
// Librabries
import React, { useEffect, useState } from 'react';
import ClassroomService from '../../../../services/classroom.service';
// UI Components
import TextField from '@mui/material/TextField';

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
      : [{ name: '', maxScore: 0, ordinal: 0 }],
  };

  const onSubmit = (fields) => {
    // display form field values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ errors, values, touched, setValues, handleChange, handleBlur }) => {
        return (
          <Form>
            <FieldArray name="gradesList">
              {({ insert, remove, push }) =>
                values.gradesList.map((grade, i) => {
                  const gradeErrors =
                    (errors.gradesList?.length && errors.gradesList[i]) || {};
                  const gradeTouched =
                    (touched.gradesList?.length && touched.gradesList[i]) || {};
                  return (
                    <div key={i}>
                      <TextField
                        autoFocus
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
                    </div>
                  );
                })
              }
            </FieldArray>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GradesStructureForm;
