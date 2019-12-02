import {
  SAVE_ORDER,
  ADD_TOPPING,
  GET_ALL_PRODUCT_EXCEPT_TOPPING,
  GET_TOTAL_PRICE,
  DELETE_TOPPING,
} from '../assets/type';
import {useTheme} from 'react-navigation';
const topping = {
  name: '',
  idTopping: 0,
  price: 0,
  soLuong: 0,
};

const orderItem = {
  id: 0,
  name: '',
  soLuong: 0,
  size: '',
  price: 0,
  idCat: 0,
  topping: [],
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
export default function OrderStore(state = [], action) {
  if (action.type === SAVE_ORDER) {
    console.log('SAVE ORDER', 'action', action);
    const {newOrder} = action;
    let index;
    const oldItem = state.find((value, _index) => {
      if (
        value.name === newOrder.name &&
        value.size === newOrder.size &&
        value.topping.length === newOrder.topping.length
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
    const {data} = action; //{topping,indexProduct}
    let itemNeedToTakeTopping = state[data.indexProduct];
    const newState = [...state];

    if (itemNeedToTakeTopping.soLuong > 1) {
      //tách cái item đó ra , 1 là như cũ, 2 là item mới sẽ cần thêm topping vào
      const cloneOrderItem1 = getFreshOrderItem(itemNeedToTakeTopping); //item cu
      //tru so luong di cho 1

      //Cai nay thi thay doi ?
      cloneOrderItem1.soLuong = cloneOrderItem1.soLuong - 1;

      console.log('cloneOrderItem1 ', cloneOrderItem1);
      //push vao newState
      newState.push(cloneOrderItem1);
      //bat dau la tao ra mot item moi, add topping vao
      const cloneOrderItem2 = getFreshOrderItem(cloneOrderItem1);
      cloneOrderItem2.soLuong = 1;
      //hoac co the gan truc tiep vao thagn kia tren
      itemNeedToTakeTopping = Object.assign({}, cloneOrderItem2);
    }
    // console.log(
    //   'data ',
    //   data,
    //   'Item need to take toppping',
    //   itemNeedToTakeTopping,
    // );

    if (itemNeedToTakeTopping.topping.length === 0) {
      //chua co topping nao
      itemNeedToTakeTopping.topping.push(data.topping);
    } else {
      //da co topping
      //check xem product nay da co topping nhu the nay hay chua ?
      let toppingIndex;
      const isToppingThere = itemNeedToTakeTopping.topping.filter(
        (value, index) => {
          if (value.idTopping === data.topping.idTopping) {
            toppingIndex = index;
            return value;
          }
        },
      );
      if (isToppingThere.length > 0) {
        itemNeedToTakeTopping.topping[toppingIndex].soLuong =
          itemNeedToTakeTopping.topping[toppingIndex].soLuong + 1;
        //neu co roi thi tang so luong cua topping len
      } else {
        itemNeedToTakeTopping.topping.push(data.topping);
        //neu chua co thi push vao
      }
    }

    newState[data.indexProduct] = itemNeedToTakeTopping;
    //check lai xem item nay da co chua , neu co roi thi xoa item kia, cong them so luong cho item nay

    const result = orderListWithoutDuplicatedItem(
      itemNeedToTakeTopping,
      newState,
      data.indexProduct,
    );

    //check lai lan cuoi neu ma co item nao trung, gop lai voi nhau
    // const finalState = newState.reduce((acc, currentValue, index) => {
    //   const result = isOrderListDuplicated(index, newState);
    //   acc = [...result];
    //   return acc;
    // }, []);

    // // console.log('newState', newState);
    // console.log('Final state', finalState);
    console.log('STATE RESULT ', result);
    return result;
  } else if (action.type === DELETE_TOPPING) {
    console.log('DELTE TOPPING');
    const {data} = action; //{indexProduct,idTopping}
    let newState = [...state];

    const itemNeedToDeleteTopping = newState[data.indexProduct];
    let toppingIndex;
    const toppingNeedToDelete = itemNeedToDeleteTopping.find((value, index) => {
      if (value === data.idTopping) {
        toppingIndex = index;
        return value;
      }
    });

    if (itemNeedToDeleteTopping.soLuong > 1) {
      //tru so luong xuong 1 don vi
      toppingNeedToDelete.soLuong = toppingNeedToDelete.soLuong - 1;
    } else if (itemNeedToDeleteTopping.soLuong === 1) {
      //xoa topping
      delete itemNeedToDeleteTopping.topping[toppingIndex];
      newState = newState.filter(value => value !== undefined);
    }
    //sau khi thay doi so luong topping, kiem tra xem product day co
    //trung voi  product khac hay khong
    // neu trung thi gop lai
    newState = orderListWithoutDuplicatedItem(
      itemNeedToDeleteTopping,
      newState,
      data.indexProduct,
    );
    return newState;
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
  const arrayOfIndexOrderItem = [];
  const item = Object.assign({}, _item);
  const newState = list.map(value => Object.assign({}, value));
  const listSize = newState.length;
  for (let i = 0; i < listSize; i++) {
    if (newState[i].idCat === 7) {
      continue;
    }
    if (i === indexOfCurrentItem) {
      continue;
    }
    if (
      item.id === newState[i].id &&
      item.topping.length === newState[i].topping.length &&
      item.size === newState[i].size
    ) {
      const toppingListSize = item.topping.length;
      for (let j = 0; j < toppingListSize; j++) {
        const toppingItem = item.topping[j];

        for (let k = 0; k < toppingListSize; k++) {
          const nextToppingItem = newState[i].topping[k];
          if (
            toppingItem.idTopping === nextToppingItem.idTopping &&
            toppingItem.soLuong === nextToppingItem.soLuong
          ) {
            count = count + 1;
            // arrayOfIndexOrderItem.push(i);
            // quantity = newState[i].soLuong;
            //````````````````````````
            //`````````````````````````
            //````````````````````````
            // kiểm tra lại trường hợp khác số lượng và khác size
          }
        }
        if (count === item.topping.length) {
          arrayOfIndexOrderItem.push(i);
          quantity = newState[i].soLuong;
        }
      }
    }
  }
  if (quantity > 0) {
    console.log('FINAL STATE ', newState);
    newState[indexOfCurrentItem].soLuong = quantity + 1;

    for (let i = 0; i < arrayOfIndexOrderItem.length; i++) {
      delete newState[arrayOfIndexOrderItem[i]];
    }

    return newState.filter(value => value !== undefined);
  }
  console.log('FINAL STATE 1 ', newState);
  return list;
}
// function isOrderListDuplicated(pos, list) {
//   const sizeList = list.length;
//   //[0,1,2,3,4] //4
//   const item = list[pos];
//   const toppingItemListLength = item.topping.length;

//   //check tat ca item tu pos tro ve
//   for (let index = pos + 1; index < sizeList - 1; index++) {
//     //check het tat ca thong tin
//     const nextItem = list[index];
//     if (nextItem.idCat !== 7) {
//       if (
//         item.id === nextItem.id &&
//         toppingItemListLength === nextItem.topping.length
//       ) {
//         //check item topping
//         console.log(
//           'Check order trung ',
//           'Có một order trùng id và topping length. Bat dau kiem tra xem topping co trùng hay ko ',
//         );
//         if (isToppingDuplicated(item.topping, nextItem.topping)) {
//           list[pos].soLuong = list[pos].soLuong + 1;
//           delete list[index];
//         }
//       }
//     }
//   }
//   const result = list.filter(value => value !== undefined);
//   console.log('Check order trung', 'Result is ', result);
//   return result;
// }

// function isToppingDuplicated(toppingList1, toppingList2) {
//   console.log('Check order trung ', 'Vô hàm isToppingDuplicated');
//   const arrayOfDuplicatedToppingIndex = [];

//   //thong tin ve current topping
//   const toppingItemListLength = toppingList1.length;
//   const toppingItemList = toppingList1;

//   //thong tin ve next topping
//   const nextToppingItemList = toppingList2;
//   const nextToppingItemListLength = nextToppingItemList.length;

//   // console.log('Check order trung', 'toppingItemList: ', toppingItemList);
//   // console.log('Check order trung', 'nextToppingList: ', nextToppingItemList);

//   for (let index = 0; index < toppingItemListLength; index++) {
//     const toppingItem = toppingItemList[index];
//     console.log('Check order trung ', 'toppingItem ', toppingItem);
//     for (let _index = 0; _index < nextToppingItemListLength; _index++) {
//       const nextToppingItem = nextToppingItemList[_index];
//       console.log('Check order trung ', 'nextToppingItem ', nextToppingItem);
//       if (toppingItem.idTopping === nextToppingItem.idTopping) {
//         arrayOfDuplicatedToppingIndex.push(index);
//       }
//     }
//   }
//   console.log(
//     'Check order trung',
//     'arrayOfDuplicatedToppingIndex is ',
//     arrayOfDuplicatedToppingIndex,
//   );
//   if (arrayOfDuplicatedToppingIndex.length === toppingItemListLength) {
//     console.log('Check order trung', ' Tất cả các topping đều trùng ');
//     return true;
//   }
//   console.log('Check order trung', 'Topping không trùng');
//   return false;
// }

//[0,1,3,1,4,5,3]
// index=0
// so sánh 0 với 1,3,1,4,5,6
// ko có
// so sánh 1 với 3,1,4,5,3
// có 1, push vào mảng*
// so sánh 3 với 1,4,5,3
// có 3, push vào mảng*
// so sánh 1 với
