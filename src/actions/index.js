import {
  SAVE_MENU,
  SAVE_ORDER,
  ADD_TOPPING,
  GET_ALL_PRODUCT_EXCEPT_TOPPING,
  DELETE_TOPPING,
  DELETE_ORDER,
  RESET_ORDER_STORE,
  SAVE_DATA_TO_ORDER_STORE,
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
export const deleteOrder = index => ({
  type: DELETE_ORDER,
  index: index,
});
export const saveDataToOrderStore = data => ({
  type: SAVE_DATA_TO_ORDER_STORE,
  data: data,
});
export const resetOrderStore = () => ({
  type: RESET_ORDER_STORE,
});
