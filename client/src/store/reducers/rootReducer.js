import { combineReducers } from 'redux';
import classReducer from './classReducer';

const rootReducer = combineReducers({
    class: classReducer
});

export default rootReducer;