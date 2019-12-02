import {
  SAVE_MENU,
  SAVE_ORDER,
  ADD_TOPPING,
  GET_ALL_PRODUCT_EXCEPT_TOPPING,
  DELETE_TOPPING,
} from './../assets/type';
export const saveMenu = dataJS => ({type: SAVE_MENU, dataJS: dataJS});
export const saveOrder = newOrder => ({type: SAVE_ORDER, newOrder: newOrder});
export const addTopping = (topping, indexProduct) => ({
  type: ADD_TOPPING,
  data: {topping: topping, indexProduct: indexProduct},
});
export const saveAllProductExceptTopping = orderList => ({
  type: GET_ALL_PRODUCT_EXCEPT_TOPPING,
  orderList: orderList,
});
export const deleteTopping = (indexProduct, idTopping) => ({
  type: DELETE_TOPPING,
  data: {indexProduct: indexProduct, idTopping: idTopping},
});
