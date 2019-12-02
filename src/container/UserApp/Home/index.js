/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-did-update-set-state */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DanhSachBan from './RCLVD_danhSachBan';
import CafeAPI from './../../../services/CafeAPI';
import {firebase} from '@react-native-firebase/database';

const db = firebase.database();

class HomeScreen extends Component {
  async componentDidMount() {
    await db.ref().on('value', snapshot => {
      const data = snapshot.val();
      const tableDetail = Object.assign({}, data.ChiTietBan);
      const thongTinCafe = Object.assign({}, data.ThongTinCafe);
      this.setState({
        isLoading: true,
        tableDetail: tableDetail,
        thongTinCafe: thongTinCafe,
      });
    });
  }

  componentDidUpdate(preProps, prevState) {
    if (prevState.tableDetail !== this.state.tableDetail) {
      this.setState({isLoading: false});
      console.log('TableDetail', this.state.tableDetail);
    }
    if (prevState.thongTinCafe !== this.state.thongTinCafe) {
      this.setState({isLoading: false});
      console.log('thongTinCafe', this.state.thongTinCafe);
    }

    // console.log('CafeInfo', this.state.getCafeInfo);
  }
  constructor(args) {
    super(args);
    this.state = {
      tableDetail: {},
      thongTinCafe: {},
      isLoading: true,
    };
  }

  render() {
    if (this.state.isLoading) {
      return <Text>Loading ...</Text>;
    } else {
      return (
        <View style={styles.container}>
          <DanhSachBan
            navigation={this.props.navigation}
            tableDetail={this.state.tableDetail}
          />
        </View>
      );
    }
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lauStyle: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    opacity: 1,
  },
});
