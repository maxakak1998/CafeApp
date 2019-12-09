import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import MySwipeable from '../../../components/Swipeable';
import OrderItem from './../../../components/OrderItem';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {Overlay, Icon, Button} from 'react-native-elements';
import ToppingListModal from '../../../components/ToppingModal';
import {firebase} from '@react-native-firebase/database';
const db = firebase.database();
const ViewType = {
  OrderListType: 0,
  MenuItemListType: 1,
  CatItemListType: 2,
};

const {width, height} = Dimensions.get('window');
class OrderList extends Component {
  async componentDidMount() {
    //call api lay order ve
    // const {saveDataToOrderStore} =this.props;
    // const result= await fetch("http://coffee.gear.host/api/getDetailBillByIdTable?idTable=4");
    // const data=await result.json();
    // saveDataToOrderStore(data);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.orderStore !== nextProps.orderStore) {
      console.log('Changed order !!! ', nextProps);
      const totalPrice = nextProps.orderStore.reduce((acc, value) => {
        acc =
          acc +
          value.price +
          value.topping.reduce((acc, value) => {
            if (value.soLuong === 0) {
              return acc;
            }
            return acc + value.price;
          }, 0);
        return acc;
      }, 0);

      this.setState({
        orderListDataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(nextProps.orderStore),
        totalPrice: totalPrice,
        isLoading: true,
      });
      // this.props.saveAllProductExceptTopping(nextProps.orderStore);
    }
  }
  constructor(args) {
    super(args);
    this.state = {
      indexItemNeedToTakeTopping: -1,
      orderItem: {},
      isVisible: false,
      orderListDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows([]),
    };

    this.orderListLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.OrderListType;
      },
      (type, dim) => {
        dim.height = height * 0.1;
        dim.width = width;
      },
    );
  }
  removeItemInOrderList = index => {
    this.props.deleteOrder(index);
  };
  sendBillAPI = async order => {
    console.log('orderStore ', order);
    const topping = {
      IdTopping: -1,
      PriceTopping: -1,
      Quantity: -1,
    };
    const product = {
      IdProduct: -1,
      PriceProduct: -1,
      Quantity: -1,
      toppingAdds: [],
    };
    const objectBill = {
      IdTable: 4,
      NameTable: 'Bàn 4',
      IdAccount: 'an.nd',
      Product: [],
    };

    order.map(value => {
      product.IdProduct = value.id;
      product.PriceProduct = value.price / value.soLuong;
      product.Quantity = value.soLuong;
      console.log('Order value ', value);
      if (value.topping.length > 0 && value.topping[0].soLuong === 0) {
        product.toppingAdds = [];
      } else {
        product.toppingAdds = value.topping.map(_value => {
          console.log('Value topping ', _value);
          topping.IdTopping = _value.idTopping;
          topping.PriceTopping = _value.price / _value.soLuong;
          topping.Quantity = _value.soLuong;
          return Object.assign({}, topping);
        });
      }

      objectBill.Product.push(Object.assign({}, product));
    });

    console.log('Object bill', JSON.stringify(objectBill));

    order.map(async (value, indexOrder) => {
      await db
        .ref('OrderBills/B1/Bills')
        .child(indexOrder.toString())
        .set({
          NameProduct: value.name,
          Size: value.size,
          SoLuong: value.soLuong,
          Status: false,
        });
      if (value.topping.length === 1 && value.topping[0].soLuong === 0) {
      } else {
        value.topping.map(async (_value, indexTopping) => {
          await db
            .ref(`OrderBills/B1/Bills/${indexOrder}/Topping`)
            .child(indexTopping.toString())
            .set({
              ToppingName: _value.name,
              SoLuong: _value.soLuong,
            });
        });
      }
    });

    // const result = await fetch('http://coffee.gear.host/api/addProductToBill', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     objectBill,
    //   }),
    // });

    // console.log('result ', await result.json());
  };
  orderListRowRender = (type, data, index) => {
    const {idCat} = data;
    return (
      <MySwipeable
        index={index}
        idCat={idCat}
        removeItemInOrderList={this.removeItemInOrderList}>
        <View style={styles.viewContainer}>
          <Text style={styles.text}>{index}</Text>
        </View>
        <OrderItem
          showModal={this.updateToppingModal}
          index={index}
          updateOrderList={this.updateOrderList}
          data={data}
        />
      </MySwipeable>
    );
  };
  renderRclOrderList() {
    const size = this.state.orderListDataProvider.getSize();
    return !!size ? (
      <RecyclerListView
        layoutProvider={this.orderListLayoutProvider}
        rowRenderer={this.orderListRowRender}
        dataProvider={this.state.orderListDataProvider}
        // extendedState={this.state.orderListDataProvider}
        showsVerticalScrollIndicator={false}
      />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: 'grey',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.text}>Trống</Text>
      </View>
    );
  }
  showModal() {
    this.setState({
      isVisible: true,
    });
  }
  updateToppingModal = index => {
    // const orderItem = Object.assign(
    //   {},
    //   this.state.orderListDataProvider.getDataForIndex(index),
    // );
    // orderItem.topping = orderItem.topping.map(value =>
    //   Object.assign({}, value),
    // );
    console.log('UPDATE TOPPING MODAL ');
    if (!this.state.isVisible) {
      this.showModal();
    }
    this.setState({
      // orderItem: !!orderItem ? Object.assign(orderItem, {index: index}) : {},
      indexItemNeedToTakeTopping: index,
    });
  };

  renderButtonOrder() {
    const {orderStore} = this.props;
    const size = orderStore.length;
    if (!!size) {
      return (
        <Button
          containerStyle={{marginLeft: 20}}
          onPress={() => {
            this.sendBillAPI(orderStore);
          }}
          title="Order"
          raised
        />
      );
    }
    return (
      <Button
        containerStyle={{marginLeft: 20, backgroundColor: 'grey'}}
        title="Order"
        titleStyle={{color: 'white'}}
        type="outline"
        disabled
      />
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

  render() {
    const {totalPrice, orderItem} = this.state;
    const _totalPrice = this.getPrice(totalPrice);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="silverware-fork-knife"
            type="material-community"
            color="black"
            onPress={() => {
              this.props.navigation.navigate('Kitchen');
            }}
          />
          <Text style={styles.text}>Bàn của Kiệt</Text>
          <View style={styles.headerRight}>
            <Text style={styles.text}>Tổng tiền: </Text>
            <Text style={{...styles.text, color: 'red'}}>{_totalPrice} đ</Text>
          </View>
          {this.renderButtonOrder()}
        </View>
        {this.renderRclOrderList()}
        {this.state.isVisible && (
          <Overlay
            animationType="slide"
            onBackdropPress={() => {
              this.setState({isVisible: false});
            }}
            children={
              <ToppingListModal
                // orderItem={orderItem}
                deleteTopping={this.props.deleteTopping}
                indexItemNeedToTakeTopping={
                  this.state.indexItemNeedToTakeTopping
                }
                addTopping={this.props.addTopping}
              />
            }
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            isVisible={this.state.isVisible}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  orderStore: state.OrderStore,
});
export default connect(mapStateToProps, actions)(OrderList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  header: {
    backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  headerText: {
    fontSize: 16,
    color: 'black',
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  viewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.1,
    flex: 1,
    elevation: 1,
    borderBottomRightRadius: 1,
    borderTopRightRadius: 1,
    maxWidth: 22,
  },
});
