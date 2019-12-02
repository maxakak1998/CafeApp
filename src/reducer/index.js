import {combineReducers} from 'redux';
import MenuStore from './MenuStore';
import OrderStore from './OrderStore';
import OrderWithoutToppingStore from './OrderWithoutToppingStore';

const rootReducer = combineReducers({
  MenuStore,
  OrderStore,
  OrderWithoutToppingStore,
});

export default rootReducer;
