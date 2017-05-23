import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import fool from './fool';

const rootReducer = combineReducers({
  fool,
  form: formReducer,
});
export default rootReducer;
