import React, {Component} from 'react';
import {View, Button, StyleSheet} from 'react-native';
// import DanhSachBan from './RCLVD_danhSachBan';

class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <DanhSachBan /> */}
        <Text>Home</Text>
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
