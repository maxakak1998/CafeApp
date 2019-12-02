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
          <Icon
            onPress={() => {}}
            name="delete"
            type="antdesign"
            reverse
            color="red"
            size={25}
          />
        </View>
      </Animated.View>
    );
  };
  render() {
    const {idCat, children, index, removeItemInOrderList} = this.props;
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
          if (idCat !== 7) {
            this.swipeable.close();
            removeItemInOrderList(index);
          }
        }}
        useNativeAnimations={true}
        renderRightActions={idCat !== 7 ? this.renderRemoveButton : null}>
        <View
          style={{
            ...styles.orderListContainer,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {children}
        </View>
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
  },
});
