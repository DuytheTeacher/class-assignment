const { default: actionTypes } = require('store/actions/actionTypes');

const initState = {
  gradesList: [],
};

const classReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_GRADES_LIST:
      return {
        ...state,
      };

    case actionTypes.SET_GRADES_LIST:
      return {
        ...state,
        gradesList: [...action.gradesList]
      };

    default:
      return state;
  }
};

export default classReducer;