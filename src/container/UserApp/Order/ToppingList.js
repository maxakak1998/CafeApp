import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import ToppingItem from '../../../components/ToppingItem';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
const {width, height} = Dimensions.get('window');
class ToppingList extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      this.props.orderWithoutToppingStore !== nextProps.orderWithoutToppingStore
    ) {
      const {orderWithoutToppingStore} = nextProps;
      this.setState({
        toppingListDataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(orderWithoutToppingStore),
      });
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.state.activeToppingTab !== nextState.activeToppingTab) {
      const {getWhichToppingIsChoosing} = this.props;
      getWhichToppingIsChoosing(nextState.activeToppingTab.tab);
    }
  }
  componentDidMount() {
    this.setState({
      toppingListDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.orderWithoutToppingStore),
    });
  }
  constructor(args) {
    super(args);
    this.state = {
      toppingListDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows([]),
      activeToppingTab: {tab: -1},
    };
    this.layoutProvider = new LayoutProvider(
      index => {
        return 1;
      },
      (type, dim) => {
        dim.height = 70;
        dim.width = width;
      },
    );
  }
  changeActiveToppingTab = rowIndex => {
    console.log('Row index is ', rowIndex);
    const {activeToppingTab} = this.state;
    const newActiveToppingTab = Object.assign({}, activeToppingTab);
    newActiveToppingTab.tab = rowIndex;
    this.setState({activeToppingTab: newActiveToppingTab});
  };

  rowRender = (type, data, index) => {
    console.log('DATA TOPPING LIST ', data);
    const {topping, _saveOrder} = this.props;
    return (
      <ToppingItem
        _saveOrder={_saveOrder}
        activeTab={this.state.activeToppingTab.tab}
        changeActiveToppingTab={this.changeActiveToppingTab}
        data={data}
        rowIndex={index}
        //truyen action de luu topping qua ben kia
        addTopping={this.props.addTopping}
        topping={topping}
      />
    );
  };

  render() {
    const size = this.state.toppingListDataProvider.getSize();
    if (!!size) {
      return (
        <RecyclerListView
          dataProvider={this.state.toppingListDataProvider}
          layoutProvider={this.layoutProvider}
          rowRenderer={this.rowRender}
          extendedState={this.state.activeToppingTab}
        />
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = state => ({
  orderWithoutToppingStore: state.OrderWithoutToppingStore,
});
export default connect(mapStateToProps, actions)(ToppingList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
