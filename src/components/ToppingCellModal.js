import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
const {width} = Dimensions.get('window');
class ToppingCellModal extends Component {
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

  addMore = () => {
    const {addTopping, toppingValue, indexProduct} = this.props;

    addTopping(toppingValue, indexProduct);
  };
  minus = () => {
    const {deleteTopping, toppingValue, indexProduct} = this.props;
    if (toppingValue.soLuong > 0) {
      deleteTopping(indexProduct, toppingValue.idTopping);
    }
  };
  render() {
    const {toppingValue} = this.props;
    const _price =
      toppingValue.soLuong === 0
        ? toppingValue.price + '.000'
        : this.getPrice(toppingValue.price);
    return (
      <TouchableOpacity style={{flex: 1}} activeOpacity={0.6}>
        <View style={styles.container}>
          <Text
            style={{
              ...styles.text,
              width: width * 0.25,
              textAlign: 'center',
            }}>
            {toppingValue.name}
          </Text>
          <View style={styles.soLuongContainerParent}>
            <View style={styles.soLuongContainerChild}>
              <Icon
                onPress={this.addMore}
                name="plus-circle"
                type="material-community"
              />

              <Text style={{...styles.text, marginHorizontal: 5}}>
                {toppingValue.soLuong}
              </Text>

              <Icon
                onPress={this.minus}
                name="minus-circle"
                type="material-community"
              />
            </View>
            <Text style={styles.text}>{_price} đ</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default ToppingCellModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    borderWidth: 0.2,
    borderBottomColor: 'black',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  soLuongContainerParent: {
    flex: 1,
    justifyContent: 'space-around',
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
