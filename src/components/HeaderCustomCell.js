import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class ScrollabeTopBarCell extends Component {
  constructor(args) {
    super(args);
    this.state = {
      currentTab: 0,
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log(`Số lầu hiện tại : ${nextProps.soLau}`);
    console.log(`Vị trí active tab : ${nextProps.activeTab}`);
  }
  componentDidMount() {
    const {soLau} = this.props;
    this.setState({currentTab: soLau});
  }
  render() {
    const {currentTab} = this.state;
    const {activeTab} = this.props;
    const handlerTopBarChangeStyle =
      activeTab === currentTab ? styles.activeBg : styles.inActiveBg;

    return (
      <View style={{...styles.tabBar, ...handlerTopBarChangeStyle}}>
        <Text>Lầu {this.props.soLau}</Text>
      </View>
    );
  }
}
export default ScrollabeTopBarCell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    fontWeight: 'bold',
  },
  inActiveText: {
    fontWeight: 'normal',
  },
  inActiveBg: {
    backgroundColor: 'white',
  },
  activeBg: {
    backgroundColor: 'green',
  },
  tabBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'black',
  },
});
