import {combineReducers} from 'redux';
const fakeReducer = () => {
  return 'Fakes';
};
const rootReducer = combineReducers({
  fakeReducer,
});

export default rootReducer;
