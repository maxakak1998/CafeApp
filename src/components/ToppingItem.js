import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, ToastAndroid} from 'react-native';
import {CheckBox} from 'react-native-elements';
import ToppingCellItem from './ToppingCellItem';

const {width} = Dimensions.get('window');

class ToppingItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      addTopping,
      data,
      changeActiveToppingTab,
      activeTab,
      rowIndex,
      topping,
      _saveOrder,
    } = this.props;
    const isActive = rowIndex === activeTab ? true : false;
    console.log('IS active tab ', isActive);
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <Text style={styles.text}>{data.id}</Text>
        <CheckBox
          onPress={() => {
            console.log('On press');
            if (!isActive) {
              changeActiveToppingTab(rowIndex);
              _saveOrder();
              addTopping(topping, data.id);
              ToastAndroid.show('Thêm thành công !', ToastAndroid.SHORT);
            }
          }}
          checked={isActive}
          containerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={<ToppingCellItem data={data} />}
        />
      </View>
    );
  }
}
export default ToppingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
