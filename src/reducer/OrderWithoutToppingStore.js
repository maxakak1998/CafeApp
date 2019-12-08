import {GET_ALL_PRODUCT_EXCEPT_TOPPING} from './../assets/type';

export default function OrderWithoutToppingStore(state = [], action) {
  if (action.type === GET_ALL_PRODUCT_EXCEPT_TOPPING) {
    const {orderList} = action;

    const newState = [...orderList].reduce((acc, value, index) => {
      // const isInToppingZone = value.toppingZone.some(
      //   value => value.IdProduct === topping.idTopping,
      // );
      value.idCat !== 7 &&
        // isInToppingZone &&
        acc.push(Object.assign({}, value, {id: index}));
      return acc;
    }, []);

    return newState;
  }
  return state;
}
