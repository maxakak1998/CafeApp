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
import CafeAPI from './../../../services/CafeAPI';
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
const textSize = 16;
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
  'Snack',
];
class Order extends Component {
  componentDidMount() {
    //lay danh sach cac mon tu api
    this.updateMenuList(0);
  }

  constructor(props) {
    super(props);
    this.catLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.CatItemListType;
      },
      (type, dim) => {
        dim.height = height * 0.1;
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
      catDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(categoryListMock),
    };
  }

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
    // console.log('index', index);

    const {activeCategoryTab} = this.state;

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

  openToppingModal = (topping, saveOrder) => {
    console.log('Open topping modal');
    this.saveOrder = null;
    console.log('Topping in Order is ', topping);
    this.setState({chooseTopping: true, topping: topping});
    this.saveOrder = saveOrder;

    console.log(saveOrder);
  };

  getWhichToppingIsChoosing = index => {
    this.setState({activeTabTopping: index});
  };

  renderMenu() {
    if (this.state.isMenuItemLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={20} style={{flex: 1}} />
        </View>
      );
    }
    return <MenuList openToppingModal={this.openToppingModal} />;
  }

  render() {
    const {topping} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.orderList}>
          <OrderList topping={topping} />
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
        {/* {this.state.chooseTopping && (
          <Overlay
            animationType="slide"
            onBackdropPress={() => {
              this.setState({chooseTopping: false, activeTabTopping: -1});
            }}
            height={height / 2}
            children={
              <ToppingList
                _saveOrder={this.saveOrder}
                getWhichToppingIsChoosing={this.getWhichToppingIsChoosing}
                topping={topping}
              />
            }
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            isVisible={this.state.chooseTopping}
          />
        )} */}
      </View>
    );
  }
}
const mapStateToProps = state => ({
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

  text: {
    fontSize: textSize,
    color: 'black',
  },

  orderListContainer: {
    flex: 1,
  },
  catContainer: {
    flex: 1,
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
