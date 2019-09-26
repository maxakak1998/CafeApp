/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class BanCafe extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Bàn 1</Text>
        <Text style={{alignSelf: 'center'}}>Trống</Text>
      </View>
    );
  }
}
export default BanCafe;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    borderRadius: 20,
  },
});
