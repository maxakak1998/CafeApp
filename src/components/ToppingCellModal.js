import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
const {width, height} = Dimensions.get('window');
class ToppingCellModal extends Component {
  render() {
    const {toppingValue, indexProduct, index} = this.props; // da co index product va toppingvalue
    //tao reducer de xu ly
    return (
      //   <View style={styles.container}>
      //     <Text style={styles.text}>{index} </Text>
      //     <Text style={styles.text}>{toppingValue.name} </Text>
      //     <Text style={toppingValue.text}> - </Text>
      //     <Text style={styles.text}>{toppingValue.soLuong}</Text>
      //     <Icon name="delete" type="material-community" color="black" />
      //   </View>
      <TouchableOpacity
        style={{flex: 1}}
        activeOpacity={0.6}
        onPress={() => {}}>
        <View style={styles.container}>
          <Text
            style={{
              ...styles.text,
              width: width / 3,
              textAlign: 'center',
            }}>
            {toppingValue.name}
          </Text>
          <View style={styles.soLuongContainerParent}>
            <View style={styles.soLuongContainerChild}>
              <Icon name="plus-circle" type="material-community" />

              <Text style={{...styles.text, marginHorizontal: 8}}>
                {toppingValue.soLuong}
              </Text>

              <Icon name="minus-circle" type="material-community" />
            </View>
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
    borderWidth: 0.5,
    borderBottomColor: 'black',
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
