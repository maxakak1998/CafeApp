import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  ToastAndroid,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Icon, Button, Overlay, CheckBox} from 'react-native-elements';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
import OrderItem from '../../../components/OrderItem';
import * as actions from '../../../actions';

import MySwipeable from '../../../components/Swipeable';
import MenuItem from '../../../components/MenuItem';
import CategoryItem from '../../../components/CategoryItem';
import {API} from '../../../assets/API';
import MenuList from './MenuList';
import OrderList from './OrderList';
import ToppingList from './ToppingList';
const status = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const size = {
  Small: 'S',
  Medium: 'M',
  Large: 'L',
  Free: 'F',
};
const {width, height} = Dimensions.get('window');
const textSize = 18;
const ViewType = {
  OrderListType: 0,
  MenuItemListType: 1,
  CatItemListType: 2,
};
const categoryListMock = [
  'Caffe',
  'Ice Blend',
  'Fruit Tea',
  'Smoothie',
  'Macchiato',
  'Others',
  'Topping',
  'Snack',
];
class Order extends Component {
  componentDidMount() {
    this.setState({categoryList: categoryListMock});
    //lay danh sach cac mon tu api
    this.updateMenuList(0);
  }
  componentWillReceiveProps(nextProps) {
    // if (this.props.orderStore !== nextProps.orderStore) {
    //   console.log(
    //     'Changed props',
    //     'This props is ',
    //     this.props,
    //     'Nextprops is ',
    //     nextProps,
    //   );
    //   this.setState({
    //     orderListDataProvider: new DataProvider((r1, r2) => {
    //       return r1 !== r2;
    //     }).cloneWithRows(nextProps.orderStore),
    //   });
    // }
  }

  constructor(props) {
    super(props);
    this.orderListLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.OrderListType;
      },
      (type, dim) => {
        dim.height = 60;
        dim.width = width;
      },
    );
    this.menuItemLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.MenuItemListType;
      },
      (type, dim) => {
        dim.height = 200;
        dim.width = (width - 100) / 2 - 0.1;
      },
    );
    this.catLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.CatItemListType;
      },
      (type, dim) => {
        dim.height = 60;
        dim.width = width * 0.25;
      },
    );

    this.state = {
      topping: {},
      activeTabTopping: -1,
      chooseTopping: false,
      sizeState: 'S',
      sizeStatus: 'primary',
      price: '',
      soLuong: 0,
      isMenuItemLoading: true,
      activeCategoryTab: {index: 0},
      categoryList: [],

      catDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(categoryListMock),
    };
  }

  // removeItemInOrderList = id => {
  //   const newOrderList = this.state.orderListDataProvider
  //     .getAllData()
  //     .filter((value, index) => index !== id);

  //   console.log('newOrderListRemove', newOrderList);
  //   const totalPrice = newOrderList.reduce((currentValue, nextValue) => {
  //     return currentValue + nextValue.price * nextValue.soLuong;
  //   }, 0);

  //   this.setState({
  //     orderListDataProvider: new DataProvider((r1, r2) => {
  //       return r1 !== r2;
  //     }).cloneWithRows(newOrderList),
  //     totalPrice: totalPrice,
  //   });
  // };

  changeBackgroundCatItem = index => {
    if (this.state.activeCategoryTab.index !== index) {
      const {activeCategoryTab} = this.state;
      console.log('activeCategoryTab', activeCategoryTab);
      const newActiveCatItem = Object.assign({}, activeCategoryTab);
      newActiveCatItem.index = index;
      this.setState({activeCategoryTab: newActiveCatItem});
      this.updateMenuList(index);
    }
  };

  // setInitStateForMenuItem(priceSmall, priceMedium, priceLarge, freePrice) {
  //   const extraStateMenuItem = {
  //     _sizeState: 'S',
  //     _sizeStatus: 'primary',
  //     _price: '',
  //     _soLuong: 0,
  //   };

  //   if (!!freePrice) {
  //     extraStateMenuItem._sizeState = size.Free;
  //     extraStateMenuItem._sizeStatus = status.success;
  //     extraStateMenuItem._price = freePrice;
  //   } else {
  //     if (!!priceSmall) {
  //       extraStateMenuItem._sizeState = 'S';
  //       extraStateMenuItem._sizeStatus = status.primary;
  //       extraStateMenuItem._price = priceSmall;
  //       console.log('Small');
  //     } else if (!!priceMedium) {
  //       extraStateMenuItem._sizeStatus = status.warning;
  //       extraStateMenuItem._sizeState = 'M';
  //       extraStateMenuItem._price = priceMedium;
  //       console.log('Medium');
  //     } else if (!!priceLarge) {
  //       console.log('Large');
  //       extraStateMenuItem._sizeState = 'L';
  //       extraStateMenuItem._sizeStatus = status.error;
  //       extraStateMenuItem._price = priceLarge;
  //     }
  //   }

  //   console.log('extraStateMenuItem', extraStateMenuItem);
  //   return extraStateMenuItem;
  // }

  updateMenuList = async index => {
    console.log('UPDATE MENU LIST Index is ', index);
    this.setState({isMenuItemLoading: true});
    const result = await fetch(API.getAllProductByCategoryId(index + 1));
    console.log('RESULT', result);
    const dataJS = await result.json();
    console.log('DATAJS', dataJS);
    this.props.saveMenu(dataJS);
    this.setState({
      isMenuItemLoading: false,
    });
  };

  catRowrender = (type, data, index) => {
    const {activeCategoryTab} = this.state;
    // console.log('index', index);
    const style =
      activeCategoryTab.index === index
        ? styles.activeCatItem
        : styles.inactiveCatItem;
    return (
      <CategoryItem
        style={style}
        index={index}
        changeBackgroundCatItem={this.changeBackgroundCatItem}
        data={data}
      />
    );
  };

  renderCategory = () => {
    const {categoryList} = this.state;
    // console.log('Cat from state', categoryList);
    return (
      <RecyclerListView
        dataProvider={this.state.catDataProvider}
        extendedState={this.state.activeCategoryTab}
        layoutProvider={this.catLayoutProvider}
        showsVerticalScrollIndicator={false}
        rowRenderer={this.catRowrender}
      />
    );
  };
  //soLuong +1 or -1
  // updateOrderList = (
  //   name,
  //   _size,
  //   price,
  //   soLuong,
  //   indexToRemoved,
  //   idCat,
  //   idProduct,
  // ) => {
  //   const oldData = this.state.orderListDataProvider.getAllData();
  //   const oldDataSize = oldData.length;

  //   const topping = {
  //     idTopping: 0,
  //     price: 0,
  //   };
  //   const orderItem = {
  //     id: idProduct || -1,
  //     name: name || '',
  //     soLuong: soLuong || 0,
  //     size: _size || '',
  //     price: price || 0,
  //     idCat: idCat,
  //     topping: [],
  //   };

  //   console.log('orderItem', orderItem);
  //   console.log('oldData', oldData);
  //   let newData = [];
  //   let index; //index cua item cu
  //   //if  idCat ===7 show modal
  //   if (idCat === 7) {
  //     // console.log('Top cmn ping');
  //     topping.idTopping = idProduct;
  //     topping.price = price;

  //     console.log('Topping object: ', topping);
  //     this.setState({
  //       chooseTopping: true,
  //       topping: topping,
  //     });
  //   }

  //   if (!!oldDataSize) {
  //     //check if it have in the list
  //     const oldRow = oldData.find((value, _index) => {
  //       if (value.name === orderItem.name && value.size === orderItem.size) {
  //         index = _index; //save the index
  //         return value;
  //       }
  //     });
  //     console.log('oldRow', oldRow);
  //     if (!!oldRow) {
  //       //tim thay, tang so luong len
  //       console.log(' Tang so luong len');
  //       const soLuongMoi = oldRow.soLuong + orderItem.soLuong;
  //       console.log('');
  //       console.log('soLuongMoi', soLuongMoi);
  //       const newPrice = soLuongMoi * price;
  //       if (!!newPrice) {
  //         orderItem.soLuong = soLuongMoi;
  //         orderItem.price = newPrice;
  //         console.log('newOrderItem', orderItem);
  //         const newRow = Object.assign({}, oldData[index], orderItem);
  //         oldData[index] = newRow;
  //         newData = oldData;
  //         console.log(newData);
  //       } else {
  //         console.log('Price is 0');
  //         this.removeItemInOrderList(indexToRemoved);
  //         return;
  //       }
  //     } else {
  //       //khong tim thay, push mot item moi vao list
  //       newData = oldData;
  //       newData.push(orderItem);
  //     }
  //   } else {
  //     //have length >0

  //     newData.push(orderItem);
  //     //have length == 0
  //   }

  //   const totalPrice = newData.reduce((currentValue, nextValue) => {
  //     return currentValue + nextValue.price * nextValue.soLuong;
  //   }, 0);
  //   console.log('Total price: ', totalPrice);
  //   this.setState({
  //     orderListDataProvider: new DataProvider((r1, r2) => {
  //       return r1 !== r2;
  //     }).cloneWithRows(newData),
  //     totalPrice: totalPrice,
  //   });
  // };
  orderListRowRender = (type, data, index) => {
    // console.log('_index', _index);
    // console.log('_index', _index);
    const {name, price, size, soLuong, id, idCat} = data;
    return (
      <MySwipeable
        index={index}
        removeItemInOrderList={this.removeItemInOrderList}>
        <OrderItem
          idCat={idCat}
          id={id}
          index={index}
          updateOrderList={this.updateOrderList}
          name={name}
          size={size}
          price={price}
          soLuong={soLuong}
        />
      </MySwipeable>
    );
  };
  openToppingModal = (topping, saveOrder) => {
    console.log('Open topping modal');
    this.saveOrder = null;
    console.log('Topping in Order is ', topping);
    this.setState({chooseTopping: true, topping: topping});
    this.saveOrder = saveOrder;
    console.log(saveOrder);
  };

  renderMenu() {
    if (this.state.isMenuItemLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={20} style={{flex: 1}} />
        </View>
      );
    }
    return (
      // <RecyclerListView
      //   showsVerticalScrollIndicator={false}
      //   dataProvider={this.state.menuItemDataProvider}
      //   layoutProvider={this.menuItemLayoutProvider}
      //   rowRenderer={this.menuItemRowRender}
      //   extendedState={this.state.menuItemDataProvider}
      // />
      <MenuList openToppingModal={this.openToppingModal} />
    );
  }

  getPrice(price) {
    console.log('PRICE', price);
    if (!!price) {
      if (price > 999) {
        const priceString = price.toString();
        const lengthPrice = priceString.length;
        const addDotPrice =
          priceString[0] + '.' + priceString.slice(1, lengthPrice) + '.000';
        return addDotPrice;
      } else {
        return price + '.000';
      }
    }
    return 0;
  }
  // renderButtonOrder() {
  //   const {orderListDataProvider} = this.state;
  //   const size = orderListDataProvider.getSize();
  //   if (!!size) {
  //     return <Button containerStyle={{marginLeft: 20}} title="Order" raised />;
  //   }
  //   return (
  //     <Button
  //       containerStyle={{marginLeft: 20, backgroundColor: 'grey'}}
  //       title="Order"
  //       titleStyle={{color: 'white'}}
  //       type="outline"
  //       disabled
  //     />
  //   );
  // }

  render() {
    const {totalPrice, topping} = this.state;
    const _totalPrice = this.getPrice(totalPrice);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="silverware-fork-knife"
            type="material-community"
            color="black"
          />
          <Text style={styles.text}>Bàn 1</Text>
          <View style={styles.headerRight}>
            <Text style={styles.text}>Tổng tiền: </Text>
            <Text style={{...styles.text, color: 'red'}}>{_totalPrice} đ</Text>
          </View>
          {/* {this.renderButtonOrder()} */}
        </View>
        <View style={styles.orderList}>
          <OrderList />
        </View>
        <View style={styles.menuList}>
          <View
            style={{
              width: '25%',
            }}>
            {this.renderCategory()}
          </View>
          <View style={{flex: 1}}>{this.renderMenu()}</View>
        </View>
        {this.state.chooseTopping && (
          <Overlay
            animationType="slide"
            onBackdropPress={() => {
              this.setState({chooseTopping: false, activeTabTopping: -1});
              this.state.activeTabTopping !== -1 && this.saveOrder();
            }}
            height={height / 2}
            children={<ToppingList topping={topping} />}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            isVisible={this.state.chooseTopping}></Overlay>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  menuStore: state.MenuStore,
  orderStore: state.OrderStore,
});

export default connect(mapStateToProps, actions)(Order);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderList: {
    flex: 2,
    ...StyleSheet.hairlineWidth,
    // backgroundColor: 'red',
  },
  menuList: {
    flex: 3,
    flexDirection: 'row',
  },
  header: {
    backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    fontSize: textSize,
    color: 'black',
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  orderListContainer: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: 'black',
  },
  catContainer: {
    marginLeft: 3,
    flex: 1,
    marginVertical: 3,
    backgroundColor: '#deb887',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  activeCatItem: {
    backgroundColor: 'red',
  },
  inactiveCatItem: {
    backgroundColor: 'blue',
  },
});
