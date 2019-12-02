import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import ToppingCellModal from './ToppingCellModal';

const {width, height} = Dimensions.get('window');
class ToppingListModal extends Component {
  componentWillMount() {
    console.log(this.props.orderItem);
  }
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
      toppingDataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.orderItem.topping),
    };
  }
  rowRender = (type, data, _index) => {
    const {index} = this.props.orderItem;
    return (
      <ToppingCellModal
        index={_index}
        indexProduct={index}
        toppingValue={data}
      />
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

export default ToppingListModal;

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
