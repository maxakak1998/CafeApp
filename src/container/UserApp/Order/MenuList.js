import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {connect} from 'react-redux';
import MenuItem from '../../../components/MenuItem';
import {API} from '../../../assets/API';
import * as actions from '../../../actions';

const ViewType = {
  OrderListType: 0,
  MenuItemListType: 1,
  CatItemListType: 2,
};
const size = {
  Small: 'S',
  Medium: 'M',
  Large: 'L',
  Free: 'F',
};

const status = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
};
const {width} = Dimensions.get('window');
class MenuList extends Component {
  componentDidUpdate(prevProps, pevState) {
    if (this.props.menuStore !== prevProps.menuStore) {
      this.setState({
        menuItemDataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(this.props.menuStore),
      });
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      menuItemDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.menuStore),
    };
    this.menuItemLayoutProvider = new LayoutProvider(
      index => {
        return ViewType.MenuItemListType;
      },
      (type, dim) => {
        dim.height = 200;
        dim.width = (width * 0.75) / 2 - 0.1;
      },
    );
  }
  changeStateForMenuItem = (index, currentState) => {
    console.log('currentState', currentState);
    this.changeSize(index, currentState);
  };
  changeSize(index, currentState) {
    const oldRow = this.state.menuItemDataProvider.getDataForIndex(index);
    const {
      PriceSmallProduct: priceSmall,
      PriceMediumProduct: priceMedium,
      PriceLargeProduct: priceLarge,
    } = oldRow;
    let _size = currentState;
    if (currentState === size.Small) {
      if (!!priceLarge) {
        _size = size.Large;
      } else if (!!priceMedium) {
        _size = size.Medium;
      }
    } else if (currentState === size.Medium) {
      if (!!priceSmall) {
        _size = size.Small;
      } else if (!!priceLarge) {
        _size = size.Large;
      }
    } else if (currentState === size.Large) {
      if (!!priceMedium) {
        _size = size.Medium;
      } else if (!!priceSmall) {
        _size = size.Small;
      }
    }
    this.changeStatus(_size, oldRow, index);
  }
  changeStatus(_size, oldRow, index) {
    let _status = '';
    if (_size === size.Small) {
      _status = status.primary;
    } else if (_size === size.Medium) {
      _status = status.warning;
    } else {
      _status = status.error;
    }
    console.log('size ', _size, 'status', _status);
    this.changePrice(_size, _status, oldRow, index);
  }
  changePrice(_sizeState, _sizeStatus, oldRow, index) {
    let _price = '';
    const {
      PriceSmallProduct: priceSmall,
      PriceMediumProduct: priceMedium,
      PriceLargeProduct: priceLarge,
    } = oldRow;

    if (_sizeState === size.Small) {
      _price = priceSmall;
    } else if (_sizeState === size.Medium) {
      _price = priceMedium;
    } else {
      _price = priceLarge;
    }
    const extraChanged = {
      _price: _price,
      _sizeState: _sizeState,
      _sizeStatus: _sizeStatus,
    };
    const newRow = Object.assign({}, oldRow, extraChanged);
    const newFullData = this.state.menuItemDataProvider.getAllData();
    console.log('index123', index);
    newFullData[index] = newRow;

    console.log('NewFullDAta', newFullData);
    this.setState({
      menuItemDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(newFullData),
    });
    // this.setState({
    //   sizeState: _sizeState,
    //   sizeStatus: _sizeStatus,
    //   price: _price,
    // });
  }

  menuItemRowRender = (type, data, index) => {
    const {
      NameProduct: name,
      imgProduct: imageSource,
      _price,
      _sizeState,
      _sizeStatus,
      _soLuong,
      IdProduct: id,
      index: _index,
      idCat,
      Topping: ToppingZone,
    } = data;
    const {openToppingModal} = this.props;
    console.log('Data', data);
    return (
      <MenuItem
        updateRowState={this.changeStateForMenuItem}
        updateOrderList={this.updateOrderList}
        name={name}
        _sizeState={_sizeState}
        _price={_price}
        _sizeStatus={_sizeStatus}
        imageSource={imageSource}
        id={id}
        index={_index}
        idCat={idCat}
        openToppingModal={openToppingModal}
        ToppingZone={ToppingZone}
      />
    );
  };

  render() {
    return (
      <RecyclerListView
        showsVerticalScrollIndicator={false}
        dataProvider={this.state.menuItemDataProvider}
        layoutProvider={this.menuItemLayoutProvider}
        rowRenderer={this.menuItemRowRender}
        extendedState={this.state.menuItemDataProvider}
      />
    );
  }
}

const mapStateToProps = state => ({
  menuStore: state.MenuStore,
});
export default connect(mapStateToProps)(MenuList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
