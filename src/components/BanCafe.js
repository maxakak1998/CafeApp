/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, TouchableNativeFeedback, Text, StyleSheet} from 'react-native';

class BanCafe extends Component {
  render() {
    const tinhTrangText = this.props.tinhTrang === 'Trống' ? 'black' : 'red';
    const {navigate} = this.props.navigation;
    const {tenBan, soBan, tinhTrang} = this.props;
    return (
      <TouchableNativeFeedback
        style={{flex: 1}}
        onPress={() => {
          navigate('Order', {
            DataTable: {
              StatusTable: tinhTrang,
              NameTable: tenBan,
              IdTable: soBan,
            },
          });
        }}>
        <View style={styles.container}>
          <Text style={{top: 5, left: 5}}>{`Bàn ${this.props.soBan}`}</Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: tinhTrangText}}>{this.props.tinhTrang}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}
export default BanCafe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 3,
    borderRadius: 10,
    backgroundColor: '#deb887',
    elevation: 4,
  },
});
