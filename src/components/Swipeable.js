import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Icon} from 'react-native-elements';

class MySwipeable extends Component {
  constructor(props) {
    super(props);
  }
  updateRef = ref => {
    this.swipeable = ref;
  };

  renderRemoveButton = (progress, dragX) => {
    // console.log('progress', progress);
    // console.log('draX', dragX);
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [400, 0],
    });

    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'red',
          justifyContent: 'center',
          transform: [{translateX: trans}],
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="delete" type="antdesign" reverse color="red" size={25} />
        </View>
      </Animated.View>
    );
  };

  render() {
    const {children, index, removeItemInOrderList} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        containerStyle={{
          flex: 1,
        }}
        childrenContainerStyle={{flex: 1}}
        leftThreshold={200}
        rightThreshold={200}
        onSwipeableRightOpen={() => {
          this.swipeable.close();
          removeItemInOrderList(index);
        }}
        renderRightActions={this.renderRemoveButton}
        useNativeAnimations={true}>
        <View style={styles.orderListContainer}>{children}</View>
      </Swipeable>
    );
  }
}
export default MySwipeable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  orderListContainer: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
