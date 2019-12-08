import {
  SAVE_ORDER,
  ADD_TOPPING,
  GET_ALL_PRODUCT_EXCEPT_TOPPING,
  GET_TOTAL_PRICE,
  DELETE_TOPPING,
} from '../assets/type';
import {DELETE_ORDER} from './../assets/type';
const topping = {
  name: '', //no
  idTopping: 0,
  price: 0,
  soLuong: 0,
};

const orderItem = {
  id: 0,
  name: '',
  soLuong: 0,
  size: '', //no
  price: 0,
  idCat: 0, //no
  topping: [],
  hasJustChanged: false,
};
function getFreshOrderItem(_orderItem = orderItem) {
  const newObj = Object.assign({}, _orderItem);
  newObj.topping = getFreshTopping(_orderItem.topping);
  return newObj;
}
function getFreshTopping(_topping = topping) {
  const newObj = _topping.map(value => Object.assign({}, value));
  return newObj;
}
function compareToppingList(toppingList1, toppingList2) {
  if (toppingList1.length !== toppingList2.length) {
    return false;
  }
  let count = 0;
  const lengthList = toppingList1.length;
  for (let i = 0; i < lengthList; i++) {
    const itemList1 = toppingList1[i];
    for (let j = 0; j < lengthList; j++) {
      const itemList2 = toppingList2[j];
      if (
        itemList1.idTopping === itemList2.idTopping &&
        itemList1.soLuong === itemList2.soLuong
      ) {
        count = count + 1;
      }
    }
  }

  if (count === lengthList) {
    return true;
  }
  return false;
}
export default function OrderStore(state = [], action) {
  if (action.type === SAVE_ORDER) {
    console.log('SAVE ORDER', 'action', action);
    const {newOrder} = action;
    let index;

    const oldItem = state.find((value, _index) => {
      if (
        value.name === newOrder.name &&
        value.size === newOrder.size &&
        compareToppingList(value.topping, newOrder.topping)
      ) {
        //neu co thi save index
        console.log(
          'San pham nay dang ton tai trong order list, luu index',
          'San pham la ',
          value,
          'Index is ',
          _index,
        );
        index = _index; //save the index
        return value;
      }
    });

    if (!!oldItem) {
      //neu co thi tang so luong len
      console.log('Item nay da co trong order list, cap nhat lai item');
      const soLuongMoi = oldItem.soLuong + newOrder.soLuong;
      const newPrice = soLuongMoi * newOrder.price;
      //minus tu 1 xuong 0 =>> newPrice =0
      if (!!newPrice) {
        // neu newPrice khong bang 0 => cap nhat lai so luong va gia tien
        //clone gia tri cua oldItem thanh mot order moi
        const realOrder = getFreshOrderItem(oldItem);
        console.log('CLone oldItem : ', realOrder);
        //cap nhat lai thuoc tinh cho realOrder
        realOrder.soLuong = soLuongMoi;
        realOrder.price = newPrice;
        const newState = [...state];
        //lay vi tri item dua vao index, thay the item cu bang item moi
        newState[index] = realOrder;
        console.log('New state is ', newState);
        console.log('Old state is ', state);
        return newState;
      } else {
        //xoa order day trong order list dua vao index o tren
        const newState = state;
        delete newState[index];
        const filteredState = newState.filter(value => value !== undefined);

        return filteredState;
      }
    } else {
      //neu chua co thi
      //push 1 item vao order
      const newState = [...state];
      newState.push(newOrder);
      console.log(
        'Chua  co item nay trong order list',
        'New state is ',
        newState,
      );
      return newState;
    }
  } else if (action.type === ADD_TOPPING) {
    console.log('ADD TOPPING ');
    console.log('Action ', action);
    const {data} = action; //{topping,indexProduct}

    let itemNeedToTakeTopping = getFreshOrderItem(state[data.indexProduct]);
    if (itemNeedToTakeTopping.id === 0) {
      return state;
    }
    const priceOf1 =
      itemNeedToTakeTopping.price / itemNeedToTakeTopping.soLuong;
    const newState = [...state];

    if (itemNeedToTakeTopping.soLuong > 1) {
      //tách cái item đó ra , 1 là như cũ, 2 là item mới sẽ cần thêm topping vào
      const cloneOrderItem1 = getFreshOrderItem(itemNeedToTakeTopping); //item cu
      //tru so luong di cho 1

      //Cai nay thi thay doi ?

      cloneOrderItem1.soLuong = cloneOrderItem1.soLuong - 1;
      cloneOrderItem1.price = priceOf1 * cloneOrderItem1.soLuong;
      console.log('cloneOrderItem1 ', cloneOrderItem1);
      //push vao newState
      newState.push(cloneOrderItem1);
      //bat dau la tao ra mot item moi, add topping vao
      const cloneOrderItem2 = getFreshOrderItem(cloneOrderItem1);
      cloneOrderItem2.soLuong = 1;
      cloneOrderItem2.price = priceOf1 * cloneOrderItem2.soLuong;
      //hoac co the gan truc tiep vao thagn kia tren
      console.log('cloneOrderItem2 ', cloneOrderItem1);
      itemNeedToTakeTopping = cloneOrderItem2;
    }

    let toppingIndex;
    const isToppingThere = itemNeedToTakeTopping.topping.filter(
      (value, index) => {
        if (value.idTopping === data.topping.idTopping) {
          toppingIndex = index;
          return value;
        }
      },
    );
    let priceOf1Topping;

    if (isToppingThere.length > 0) {
      if (isToppingThere[0].soLuong === 0) {
        priceOf1Topping = isToppingThere[0].price;
      } else {
        priceOf1Topping = isToppingThere[0].price / isToppingThere[0].soLuong;
      }

      itemNeedToTakeTopping.topping[toppingIndex].soLuong =
        itemNeedToTakeTopping.topping[toppingIndex].soLuong + 1;
      itemNeedToTakeTopping.topping[toppingIndex].price =
        itemNeedToTakeTopping.topping[toppingIndex].soLuong * priceOf1Topping;

      //neu co roi thi tang so luong cua topping len
    }

    newState[data.indexProduct] = itemNeedToTakeTopping;
    console.log('NEW STATE ', newState);
    //check lai xem item nay da co chua , neu co roi thi xoa item kia, cong them so luong cho item nay
    //check lai lan cuoi neu ma co item nao trung, gop lai voi nhau
    const result = orderListWithoutDuplicatedItem(
      itemNeedToTakeTopping,
      newState,
      data.indexProduct,
    );
    console.log('STATE RESULT ', result);
    return result;
  } else if (action.type === DELETE_TOPPING) {
    console.log('DELETE TOPPING');
    const {data} = action; //{indexProduct,idTopping}
    let newState = state.map(value => {
      const toppingClone = [...value.topping];
      const newValue = Object.assign({}, value);
      newValue.topping = toppingClone;
      return newValue;
    });

    const itemNeedToDeleteTopping = newState[data.indexProduct];
    console.log('itemNeedToDelete', itemNeedToDeleteTopping);
    let toppingIndex;
    const toppingNeedToDelete = itemNeedToDeleteTopping.topping.find(
      (value, index) => {
        if (value.idTopping === data.idTopping) {
          toppingIndex = index;
          return value;
        }
      },
    );

    if (toppingNeedToDelete.soLuong > 0) {
      //tru so luong xuong 1 don vi
      let priceOf1Topping;
      priceOf1Topping = toppingNeedToDelete.price / toppingNeedToDelete.soLuong;
      toppingNeedToDelete.soLuong = toppingNeedToDelete.soLuong - 1;
      if (toppingNeedToDelete.soLuong === 0) {
        toppingNeedToDelete.price = priceOf1Topping;
      } else {
        toppingNeedToDelete.price =
          priceOf1Topping * toppingNeedToDelete.soLuong;
      }
    }
    //sau khi thay doi so luong topping, kiem tra xem product day co
    //trung voi  product khac hay khong
    // neu trung thi gop lai
    console.log('newState ', newState);
    newState = orderListWithoutDuplicatedItem(
      itemNeedToDeleteTopping,
      newState,
      data.indexProduct,
    );
    return newState;
  } else if (action.type === DELETE_ORDER) {
    console.log('DELETE ORDER ');
    const {index} = action;
    const newState = [...state];
    delete newState[index];

    console.log('newState: ', newState);
    return newState.filter(value => value !== undefined);
  }
  return state;
}
function orderListWithoutDuplicatedItem(
  _item = {},
  list = [],
  indexOfCurrentItem,
) {
  let count = 0;
  let quantity;
  const priceOf1 = _item.price / _item.soLuong;
  let IndexOfDuplicatedOrderItem;
  const item = Object.assign({}, _item);
  const newState = list.map(value => {
    const toppingClone = [...value.topping];
    const newValue = Object.assign({}, value);
    newValue.topping = toppingClone;
    return newValue;
  });
  const listSize = newState.length;
  for (let i = 0; i < listSize; i++) {
    if (i === indexOfCurrentItem) {
      continue;
    }
    newState[i].hasJustChanged = false;
    if (
      item.id === newState[i].id &&
      item.topping.length === newState[i].topping.length &&
      item.size === newState[i].size
    ) {
      const toppingListSize = item.topping.length;
      count = 0;
      for (let j = 0; j < toppingListSize; j++) {
        const toppingItem = item.topping[j];

        for (let k = 0; k < toppingListSize; k++) {
          const nextToppingItem = newState[i].topping[k];
          if (
            toppingItem.idTopping === nextToppingItem.idTopping &&
            toppingItem.soLuong === nextToppingItem.soLuong
          ) {
            count = count + 1;
            IndexOfDuplicatedOrderItem = i;
          }
        }
        if (count === item.topping.length) {
          quantity = newState[i].soLuong;
        }
      }
    }
  }
  if (quantity > 0) {
    console.log('FINAL STATE ', newState);
    newState[indexOfCurrentItem].soLuong = quantity + 1;
    newState[indexOfCurrentItem].price =
      priceOf1 * newState[indexOfCurrentItem].soLuong;
    newState[indexOfCurrentItem].hasJustChanged = true;

    delete newState[IndexOfDuplicatedOrderItem];

    return newState.filter(value => value !== undefined);
  }
  console.log('FINAL STATE 1 ', newState);
  return list;
}
