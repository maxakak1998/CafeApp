import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {Button, Icon} from 'react-native-elements';
import {firebase} from '@react-native-firebase/database';
const db = firebase.database();
const {width, height} = Dimensions.get('window');
const marginOrder = 10;
const ToppingCellKitchen = props => (
  <View style={{flex: 1, marginVertical: 5}}>
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
      }}>
      <Text style={styles.toppingName}>{props.data.ToppingName}</Text>
      <Text style={styles.soLuongTopping}>{props.data.SoLuong}</Text>
    </View>
  </View>
);

class KitchenItem extends Component {
  componentDidMount() {}
  constructor(args) {
    super(args);
    this.state = {};
  }

  renderProductWithTopping(product) {
    return (
      <View style={styles.withTopping}>
        <View style={{flex: 1.5}}>
          {this.renderProductWithoutTopping(product)}
        </View>
        {product.Topping.map(value => {
          return <ToppingCellKitchen data={value} />;
        })}
      </View>
    );
  }
  renderProductWithoutTopping(product) {
    return (
      <View style={styles.withoutTopping}>
        <Text style={styles.nameProduct}>{product.NameProduct}</Text>
        <Text style={styles.size}>{product.Size}</Text>
        <Text style={styles.soLuong}>{product.SoLuong}</Text>
      </View>
    );
  }
  renderBills(Bills = []) {
    const BillsWithFalseState = Bills.filter(value => value.Status !== true);
    if (BillsWithFalseState.length === 0) {
      this.props.resetDataSize();
    }
    console.log('BillsWithFalseState ', BillsWithFalseState);
    return BillsWithFalseState.map(order => {
      if ('Topping' in order) {
        return this.renderProductWithTopping(order);
      } else {
        return this.renderProductWithoutTopping(order);
      }
    });
  }

  render() {
    const {NameTable, IdTable, Bills} = this.props.data;
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>{NameTable}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Button
              type="clear"
              onPress={() => {
                Bills.map(async (value, index) => {
                  const updateStatus = {};
                  updateStatus[
                    `OrderBills/B${IdTable}/Bills/${index}/Status`
                  ] = true;
                  await db.ref().update(updateStatus);
                });
              }}
              icon={
                <Icon
                  name="check-bold"
                  type="material-community"
                  size={height * 0.06 - 18}
                  color="white"
                />
              }
            />
          </View>
        </View>
        <View style={{flex: 1}}>{this.renderBills(Bills)}</View>
      </View>
    );
  }
}
export default KitchenItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    height: height * 0.06,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: width / 2 - 30,
  },
  withoutTopping: {
    margin: marginOrder,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 0.6,
  },
  withTopping: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 0.6,
  },
  nameProduct: {},
  size: {
    color: 'red',
  },
  soLuong: {
    fontWeight: 'bold',
  },
});
