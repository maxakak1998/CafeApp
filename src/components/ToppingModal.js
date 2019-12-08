import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import ToppingCellModal from './ToppingCellModal';
import {connect} from 'react-redux';

const {width} = Dimensions.get('window');

class ToppingListModal extends Component {
  componentDidMount() {
    console.log('this.props ', this.props);
    const {indexItemNeedToTakeTopping, orderStore} = this.props;
    const topping = orderStore[indexItemNeedToTakeTopping].topping;
    const cloneTopping = topping.map(value => Object.assign({}, value));

    this.setState({
      toppingDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(cloneTopping),
      indexProduct: indexItemNeedToTakeTopping,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('Should update ?', nextProps, 'this.props ', this.props);

    const {indexItemNeedToTakeTopping} = this.props;
    try {
      if (
        nextProps.orderStore[indexItemNeedToTakeTopping] !==
        this.props.orderStore[indexItemNeedToTakeTopping]
      ) {
        const topping =
          nextProps.orderStore[indexItemNeedToTakeTopping].topping;
        const cloneTopping = topping.map(value => Object.assign({}, value));
        this.setState({
          toppingDataProvider: new DataProvider((r1, r2) => {
            return r1 !== r2;
          }).cloneWithRows(cloneTopping),
        });
      }
    } catch {
      let i;
      const orderItemHasJustChanged = nextProps.orderStore.find(
        (value, index) => {
          if (value.hasJustChanged === true) {
            i = index;
            return value;
          }
        },
      );
      this.setState({
        toppingDataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(orderItemHasJustChanged.topping),
        indexProduct: i,
      });
    }
  }
  minus = () => {
    if (this.state.soLuong > 0) {
      // this.state.soLuong=this.state.soLuong-1;
    }
  };
  // this.state.soLuong=this.state.soLuong

  constructor(args) {
    super(args);
    this.layoutProvider = new LayoutProvider(
      index => {
        return 0;
      },
      (type, dim) => {
        dim.height = 70;
        dim.width = width;
      },
    );

    this.state = {
      indexProduct: -1,
      toppingDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows([]),
    };
  }
  rowRender = (type, data, _index) => {
    const {addTopping, indexItemNeedToTakeTopping, deleteTopping} = this.props;

    return (
      <View style={{flex: 1}}>
        <ToppingCellModal
          index={_index}
          indexProduct={this.state.indexProduct}
          toppingValue={data}
          addTopping={addTopping}
          deleteTopping={deleteTopping}
        />
      </View>
    );
  };
  render() {
    const size = this.state.toppingDataProvider.getSize();
    return (
      <View style={{flex: 1}}>
        {!!size ? (
          <RecyclerListView
            rowRenderer={this.rowRender}
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.toppingDataProvider}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Trống</Text>
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  orderStore: state.OrderStore,
});
export default connect(mapStateToProps)(ToppingListModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
