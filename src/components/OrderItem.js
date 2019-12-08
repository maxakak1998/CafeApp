import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import * as actions from '../actions';
const {width} = Dimensions.get('window');

class OrderItem extends Component {
  constructor(props) {
    super(props);
  }

  addMore = () => {
    const {soLuong, name, size, price, id, idCat, topping} = this.props.data;
    const _price = price / soLuong;

    // updateOrderList(name, size, _price, 1, null, null, id);
    this.props.saveOrder({
      id: id,
      name: name,
      soLuong: 1,
      size: size,
      price: _price,
      idCat: idCat,
      topping: topping,
    });
  };

  minus = () => {
    const {
      soLuong,
      name,
      size,
      price,
      index,
      topping,
      id,
      idCat,
    } = this.props.data;
    const _price = price / soLuong;
    this.props.saveOrder({
      id: id,
      name: name,
      soLuong: -1,
      size: size,
      price: _price,
      idCat: idCat,
      topping: topping,
    });
  };
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

  getTotalPriceOfTopping(topping) {
    const totalPrice = topping.reduce((acc, value) => {
      if (value.soLuong === 0) {
        return acc;
      }
      return acc + value.price;
    }, 0);
    return totalPrice;
  }
  render() {
    const {price, name, size, soLuong, idCat, topping} = this.props.data;
    const {showModal, index} = this.props;
    const priceWithTopping = price + this.getTotalPriceOfTopping(topping);
    const _price = this.getPrice(priceWithTopping);
    return (
      <TouchableOpacity
        style={{flex: 1}}
        activeOpacity={0.6}
        onPress={() => {
          showModal(index);
        }}>
        <View style={styles.container}>
          <Text
            style={{
              ...styles.text,
              width: width / 3,
              textAlign: 'center',
            }}>
            {name}
          </Text>
          <View style={styles.soLuongContainerParent}>
            <View style={styles.soLuongContainerChild}>
              {idCat !== 7 ? (
                <Icon
                  onPress={this.addMore}
                  name="plus-circle"
                  type="material-community"
                />
              ) : null}

              <Text style={{...styles.text, marginHorizontal: 8}}>
                {soLuong}
              </Text>

              {idCat !== 7 ? (
                <Icon
                  onPress={this.minus}
                  name="minus-circle"
                  type="material-community"
                />
              ) : null}
            </View>
            <Text style={styles.text}>{_price} đ</Text>
            <Text style={styles.text}>{size}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(null, actions)(OrderItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    // backgroundColor: 'yellow',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  soLuongContainerParent: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  soLuongContainerChild: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
    justifyContent: 'space-around',
  },
});
