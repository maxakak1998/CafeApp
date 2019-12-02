import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import MySwipeable from '../../../components/Swipeable';
import OrderItem from './../../../components/OrderItem';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {Overlay} from 'react-native-elements';
import ToppingListModal from '../../../components/ToppingModal';
const ViewType = {
  OrderListType: 0,
  MenuItemListType: 1,
  CatItemListType: 2,
};
const {width} = Dimensions.get('window');
class OrderList extends Component {
  componentDidMount() {
    this.setState({
      orderListDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.orderStore),
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.orderStore !== nextProps.orderStore) {
      console.log(
        'Changed props',
        'This props is ',
        this.props,
        'Nextprops is ',
        nextProps,
      );
      this.setState({
        orderListDataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(nextProps.orderStore),
      });
      this.props.saveAllProductExceptTopping(nextProps.orderStore);
    }
  }
  constructor(args) {
    super(args);
    this.state = {
      orderItem: [],
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
        dim.height = 60;
        dim.width = width;
      },
    );
  }
  orderListRowRender = (type, data, index) => {
    // console.log('_index', _index);
    // console.log('_index', _index);
    const {name, price, size, soLuong, id, idCat, topping} = data;
    return (
      <MySwipeable
        index={index}
        idCat={idCat}
        removeItemInOrderList={this.removeItemInOrderList}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
            flex: 1,
            elevation: 1,
            borderBottomRightRadius: 1,
            borderTopRightRadius: 1,
            maxWidth: 22,
          }}>
          <Text style={styles.text}>{index}</Text>
        </View>
        <OrderItem
          showModal={this.showModal}
          idCat={idCat}
          id={id}
          index={index}
          updateOrderList={this.updateOrderList}
          name={name}
          size={size}
          price={price}
          topping={topping}
          soLuong={soLuong}
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
  showModal = index => {
    const orderItem = this.state.orderListDataProvider.getDataForIndex(index);

    this.setState({
      orderItem: !!orderItem ? Object.assign(orderItem, {index: index}) : {},
      isVisible: true,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderRclOrderList()}
        {this.state.isVisible && (
          <Overlay
            animationType="slide"
            onBackdropPress={() => {
              this.setState({isVisible: false});
            }}
            children={<ToppingListModal orderItem={this.state.orderItem} />}
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
});
