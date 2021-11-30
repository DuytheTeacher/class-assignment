import actionTypes from './actionTypes';

export const getGradesList = () => ({
    type: actionTypes.GET_GRADES_LIST,
});

export const setGradesList = (gradesList) => ({
    type: actionTypes.SET_GRADES_LIST,
    gradesList
});