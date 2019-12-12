import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MySwipeable from '../../../components/Swipeable';
import OrderItem from './../../../components/OrderItem';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {Overlay, Icon, Button} from 'react-native-elements';
import ToppingListModal from '../../../components/ToppingModal';
import {firebase} from '@react-native-firebase/database';
import {API} from './../../../assets/API';
const db = firebase.database();
const ViewType = {
  OrderListType: 0,
  MenuItemListType: 1,
  CatItemListType: 2,
};
let ToppingsTemp = {};
var a = [
  {
    IdDetailBill: 207,
    IdDetailTopping: 140,
    IdProduct: 39,
    IdTopping: 48,
    NameProduct: 'Matcha Macchiato',
    Quantity: 1,
    Size: 'S',
    Price: 0,
    Toppings: [
      {
        IdTopping: 0,
        NameTopping: 'Không có Topping',
        PriceTopping: 0,
        QuantityTopping: 0,
      },
    ],
  },
];

function showbill(bill) {
  let totalPrice = 0;
  let temp = 0;
  let tempIdBillDetail = 0;
  let active = 0;
  let j = 0;
  let iTemp = 0;
  for (var i = 0; i < bill.length; i++) {
    if (bill[i].Quantity > 0) {
      if (active == 0) {
        (a[i].IdDetailBill = bill[i].IdDetailBill),
          (a[i].IdDetailTopping = bill[i].IdDetailTopping),
          (a[i].IdProduct = bill[i].IdProduct),
          (a[i].NameProduct = bill[i].NameProduct),
          (a[i].Quantity = bill[i].Quantity),
          (a[i].Size = bill[i].Size),
          (a[i].Price = bill[i].Price);
        // if (bill[i].IdTopping != 0) {
        a[i].Toppings[j].IdTopping = bill[i].IdTopping;
        (a[i].Toppings[j].NameTopping = bill[i].NameTopping),
          (a[i].Toppings[j].PriceTopping = bill[i].PriceTopping),
          (a[i].Toppings[j].QuantityTopping = bill[i].QuantityTopping),
          j++;
        // }
        totalPrice +=
          (bill[i].Price + bill[i].PriceTopping * bill[i].QuantityTopping) *
          bill[i].Quantity;
        tempIdBillDetail = bill[i].IdDetailBill;
        temp = bill[i].Price;
        active = 1;
        iTemp = i;
      } else {
        if (tempIdBillDetail != bill[i].IdDetailBill) {
          let aTemp = {
            IdDetailBill: bill[i].IdDetailBill,
            IdDetailTopping: bill[i].IdDetailTopping,
            IdProduct: bill[i].IdProduct,
            NameProduct: bill[i].NameProduct,
            Quantity: bill[i].Quantity,
            Size: bill[i].Size,
            Price: bill[i].Price,
            Toppings: [],
          };
          // if (bill[i].IdTopping != 0) {
          ToppingsTemp = [
            {
              IdTopping: bill[i].IdTopping,
              NameTopping: bill[i].NameTopping,
              PriceTopping: bill[i].PriceTopping,
              QuantityTopping: bill[i].QuantityTopping,
            },
          ];
          // }
          aTemp.Toppings = ToppingsTemp;
          totalPrice +=
            (bill[i].Price + bill[i].PriceTopping * bill[i].QuantityTopping) *
            bill[i].Quantity;
          tempIdBillDetail = bill[i].IdDetailBill;
          temp = bill[i].Price;
          iTemp = iTemp + 1;
          a.push(aTemp);
        } else {
          if (bill[i].Price == temp) {
            // if (bill[i].IdTopping != 0) {
            ToppingsTemp = {
              IdTopping: bill[i].IdTopping,
              NameTopping: bill[i].NameTopping,
              PriceTopping: bill[i].PriceTopping,
              QuantityTopping: bill[i].QuantityTopping,
            };
            // }
            a[iTemp].Toppings.push(ToppingsTemp);
          } else {
            let aTemp = {
              IdDetailBill: bill[i].IdDetailBill,
              IdDetailTopping: bill[i].IdDetailTopping,
              IdProduct: bill[i].IdProduct,
              NameProduct: bill[i].NameProduct,
              Quantity: bill[i].Quantity,
              Size: bill[i].Size,
              Price: bill[i].Price,
              Toppings: [],
            };
            // if (bill[i].IdTopping != 0) {
            ToppingsTemp = [
              {
                IdTopping: bill[i].IdTopping,
                NameTopping: bill[i].NameTopping,
                PriceTopping: bill[i].PriceTopping,
                QuantityTopping: bill[i].QuantityTopping,
              },
            ];
            // }
            aTemp.Toppings = ToppingsTemp;
            totalPrice +=
              (bill[i].Price + bill[i].PriceTopping * bill[i].QuantityTopping) *
              bill[i].Quantity;
            tempIdBillDetail = bill[i].IdDetailBill;
            temp = bill[i].Price;
            iTemp = iTemp + 1;
            a.push(aTemp);
          }
        }
      }
    }
  }
  return a;
}

const {width, height} = Dimensions.get('window');
async function getRightData(data) {
  const dataLength = data.length;
  const newData = data.map(value => {
    const cloneToppings = value.Toppings.map(_value =>
      Object.assign({}, _value),
    );
    return Object.assign({}, value, {Toppings: cloneToppings});
  });

  // console.log(
  //   'Check if it equal ',
  //   newData[0].Toppings[0] === data[0].Toppings[0],
  // );

  for (let productIndex = 0; productIndex < dataLength; productIndex++) {
    const {Toppings, IdProduct, NameProduct} = data[productIndex];
    const toppingProductLength = Toppings.length;
    // console.log('Read to fetch');
    const rightTopping = [];

    const result = await fetch(
      'http://coffee.gear.host/api/getProductToppingByIdPro?idProduct=' +
        IdProduct,
    );
    const responseJS = await result.json();

    const allTopping = responseJS.Topping;
    const allToppingLength = allTopping.length;
    // console.log('ALL TOPPING ', allTopping);

    // console.log('rightTopping after clear ', rightTopping);

    //product co chua topping
    for (
      let toppingProductIndex = 0;
      toppingProductIndex < toppingProductLength;
      toppingProductIndex++
    ) {
      const toppingProductItem = Toppings[toppingProductIndex];
      for (
        let allToppingProductIndex = 0;
        allToppingProductIndex < allToppingLength;
        allToppingProductIndex++
      ) {
        const allToppingProductItem = allTopping[allToppingProductIndex];

        if (toppingProductItem.IdTopping === allToppingProductItem.IdProduct) {
          //co roi, chi can cap nhap so luong, push gia tri cu vao
          if (allToppingProductItem.IdProduct !== 0) {
            //san pham nay  co the them topping nhung order khong chon topping
            console.log('Da co ', toppingProductItem);
            rightTopping.push(toppingProductItem);
          } else {
            console.log('Thuc su khong co topping nao ca ! ', NameProduct);
          }
        } else {
          //chua co, lay product tu ben AllTopping
          console.log('Chua co ', toppingProductItem);
          rightTopping.push(
            Object.assign({
              IdTopping: allToppingProductItem.IdProduct,
              NameTopping: allToppingProductItem.NameProduct,
              PriceTopping: allToppingProductItem.PriceProduct,
              QuantityTopping: allToppingProductItem.Quantity,
            }),
          );
        }
      }
    }
    // newData[productIndex].Toppings.length =0 //cheap
    newData[productIndex].Toppings = rightTopping.map(value =>
      Object.assign({}, value),
    );
    console.log('NewProduct after changed ', newData[productIndex].Toppings);
    console.log('rightTopping before clear ', rightTopping);
  }
  console.log('New state ', newData);
  return newData;
}
class OrderList extends Component {
  async componentDidMount() {
    //call api lay order ve
    const {saveDataToOrderStore} = this.props;
    this.setState({isLoading: true});

    const result = await fetch(
      'http://coffee.gear.host/api/getDetailBillByIdTable?idTable=' +
        this.props.navigation.getParam('DataTable').IdTable,
    );
    const data = await result.json();
    console.log('DATA DEtail table ', data);
    if (data.Menus.length !== 0) {
      const formaArray = showbill(data.Menus);
      getRightData(formaArray).then(response => {
        console.log(' getRightData(formaArray)', response);
        const newState = response;
        saveDataToOrderStore(newState);
        // const newState = getRightData(formArray);
        this.setState({isLoading: false, isAgain: true});
      });
      // console.log('Show bills ', formArray);
    } else {
      this.setState({isLoading: false, isAgain: false});
    }

    // console.log('DATA result ', data);
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
      });
      // this.props.saveAllProductExceptTopping(nextProps.orderStore);
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.orderListDataProvider !== prevState.orderListDataProvider) {
  //     this.setState({isLoading: false});
  //   }
  // }
  componentWillUnmount() {
    const {resetOrderStore} = this.props;
    resetOrderStore();
  }
  constructor(args) {
    super(args);
    this.state = {
      isLoading: false,
      isAgain: false,
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
    const {navigation} = this.props;
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
      IdTable: navigation.getParam('DataTable').IdTable,
      NameTable: navigation.getParam('DataTable').NameTable,
      IdAccount: 'an.nd',
      Product: [],
      Note: 'Không có ghi chú ',
    };

    order.map(value => {
      product.IdProduct = value.id;
      product.PriceProduct = value.price / value.soLuong;
      product.Quantity = value.soLuong;
      console.log('Order value ', value);
      if (value.topping.length === 1 && value.topping[0].soLuong === 0) {
        product.toppingAdds = [];
      } else {
        product.toppingAdds = value.topping.map(_value => {
          console.log('Value topping ', _value);
          if (_value.soLuong !== 0) {
            topping.IdTopping = _value.idTopping;
            topping.PriceTopping = _value.price / _value.soLuong;
            topping.Quantity = _value.soLuong;
            return Object.assign({}, topping);
          }
        });

        product.toppingAdds = product.toppingAdds.filter(
          value => value !== null,
        );

        console.log('Topping add afters filtered ', product.toppingAdds);

        product.toppingAdds = product.toppingAdds.filter(
          value => value !== undefined,
        );
      }

      objectBill.Product.push(Object.assign({}, product));
    });

    console.log('Object bill', JSON.stringify(objectBill));

    order.map(async (value, indexOrder) => {
      await db
        .ref(`OrderBills/B${navigation.getParam('DataTable').IdTable}/Bills`)
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
            .ref(
              `OrderBills/B${
                navigation.getParam('DataTable').IdTable
              }/Bills/${indexOrder}/Topping`,
            )
            .child(indexTopping.toString())
            .set({
              ToppingName: _value.name,
              SoLuong: _value.soLuong,
            });
        });
      }
    });

    const result = await fetch('http://coffee.gear.host/api/addProductToBill', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectBill),
    });

    console.log('JSON', JSON.stringify(objectBill));

    console.log('result ', await result.json());
  };
  orderListRowRender = (type, data, index) => {
    return (
      <MySwipeable
        index={index}
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
    const {totalPrice, isLoading, orderItem} = this.state;
    const _totalPrice = this.getPrice(totalPrice);
    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={20} />
        </View>
      );
    } else {
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
              <Text style={{...styles.text, color: 'red'}}>
                {_totalPrice} đ
              </Text>
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
