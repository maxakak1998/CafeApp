import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Image, Badge} from 'react-native-elements';
import {connect} from 'react-redux';
import * as actions from '../actions';
const textSize = 16;
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
class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  changeSize() {
    const {sizeState} = this.state;
    const {priceSmall, priceMedium, priceLarge} = this.props;
    let _size = sizeState;
    if (sizeState === size.Small) {
      if (!!priceLarge) {
        _size = size.Large;
      } else if (!!priceMedium) {
        _size = size.Medium;
      }
    } else if (sizeState === size.Medium) {
      if (!!priceSmall) {
        _size = size.Small;
      } else if (!!priceLarge) {
        _size = size.Large;
      }
    } else if (sizeState === size.Large) {
      if (!!priceMedium) {
        _size = size.Medium;
      } else if (!!priceSmall) {
        _size = size.Small;
      }
    }
    this.changeStatus(_size);
  }
  changeStatus(_size) {
    let _status = '';
    if (_size === size.Small) {
      _status = status.primary;
    } else if (_size === size.Medium) {
      _status = status.warning;
    } else {
      _status = status.error;
    }
    console.log('size ', _size, 'status', _status);
    this.changePrice(_size, _status);
  }
  changePrice(_sizeState, _sizeStatus) {
    let _price = '';
    const {priceSmall, priceMedium, priceLarge} = this.props;

    if (_sizeState === size.Small) {
      _price = priceSmall;
    } else if (_sizeState === size.Medium) {
      _price = priceMedium;
    } else {
      _price = priceLarge;
    }
    this.setState({
      sizeState: _sizeState,
      sizeStatus: _sizeStatus,
      price: _price,
    });
  }

  handleTwoPointerClick = ({nativeEvent}) => {
    const {_sizeState, updateRowState, index} = this.props;
    if (_sizeState !== size.Free) {
      console.log('Not free size');
      updateRowState(index, _sizeState);
      // this.changeSize();
    }
    console.log('Two fingers tap');
    // console.log('eee', nativeEvent);
  };
  render() {
    const {
      imageSource,
      _sizeStatus,
      _sizeState,
      _price,
      name,
      updateOrderList,
      idCat,
      id,
      openToppingModal,
      ToppingZone,
    } = this.props;
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={({nativeEvent}) => {
          const {touches} = nativeEvent;
          if (touches.length === 2) {
            return true;
          }
          return false;
        }}
        onResponderRelease={this.handleTwoPointerClick}>
        <TouchableOpacity
          onPress={() => {
            console.log('ID MEnuitem', id);
            const cloneToppingZone = ToppingZone.map(value => {
              if (value.IdProduct !== 0) {
                return Object.assign(
                  {},
                  {
                    name: value.NameProduct,
                    idTopping: value.IdProduct,
                    price: value.PriceProduct,
                    soLuong: 0,
                  },
                );
              }
            });
            if (cloneToppingZone[0] === undefined) {
              cloneToppingZone.length = 0;
            }

            console.log(cloneToppingZone);
            this.props.saveOrder({
              id: id,
              name: name,
              soLuong: 1,
              size: _sizeState,
              price: _price,
              idCat: idCat,
              topping: cloneToppingZone,
              hasJustChanged: false,
              // toppingZone: ToppingZone,
            });
          }}
          style={{flex: 1}}
          activeOpacity={0.8}>
          <View style={styles.image}>
            <Badge
              value={_sizeState}
              status={_sizeStatus}
              containerStyle={{
                position: 'absolute',
                zIndex: 3,
                top: 0,
                right: 0,
              }}
            />
            <Image
              PlaceholderContent={<ActivityIndicator />}
              placeholderStyle={{flex: 1, borderRadius: 1}}
              containerStyle={{
                flex: 1,
                zIndex: -1,
                borderBottomEndRadius: 0,
              }}
              borderRadius={2}
              source={{uri: imageSource}}
            />
            <View
              style={{
                position: 'absolute',
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.text,
                  left: 2,
                  top: -2,
                  fontSize: 16,
                  color: 'red',
                }}>
                {_price}.000 đ
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={{...styles.text, padding: 2}}>{name}</Text>
        </View>
      </View>
    );
  }
}

export default connect(null, actions)(MenuItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    elevation: 1,
    borderRadius: 1,
  },
  image: {
    flex: 1,
  },
  text: {
    fontSize: textSize,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
