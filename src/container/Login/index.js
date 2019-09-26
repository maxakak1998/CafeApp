/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
} from 'react-native';
import {TapGestureHandler, State} from 'react-native-gesture-handler';

import Animated, {Easing} from 'react-native-reanimated';

const {
  event,
  Value,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  concat,
  cond,
  eq,
  set,
  block,
  timing,
  Extrapolate,
  debug,
  interpolate,
} = Animated;
const {width, height} = Dimensions.get('window');

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 2000,
    toValue: new Value(0),
    easing: Easing.out(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}
class LoginScreen extends Component {
  constructor() {
    super();
    this.btnOpacity = new Value(1);

    this.onHandlerStateChange = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.btnOpacity, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ]);
    this.closeTextInput = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.btnOpacity, runTiming(new Clock(), 0, 1)),
            ),
          ]),
      },
    ]);

    this.onLoginPress = ({nativeEvent}) => {
      const {state} = nativeEvent;
      console.log(state);
      //Login
      if (state === State.END) {
        //Chuyển sang màn hình User
        // Ân check điều kiện phân quyền ở đây
        this.props.navigation.navigate('Home');
      }
    };

    this.btnY = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      Extrapolate: Extrapolate.CLAMP,
    });
    this.bgY = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3, 0],
      Extrapolate: Extrapolate.CLAMP,
    });

    this.textInputOpacity = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputZIndex = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [2, -1],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputY = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });
    this.crossRotation = interpolate(this.btnOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 380 * 2],
    });
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        onStartShouldSetResponder={() => {
          Keyboard.dismiss();
          return false;
        }}>
        <View style={styles.container}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              transform: [{translateY: this.bgY}],
            }}>
            <Image
              style={styles.image}
              source={require('../../assets/bg.jpg')}
            />
          </Animated.View>
          <View style={styles.btnContainer}>
            <TapGestureHandler onHandlerStateChange={this.onHandlerStateChange}>
              <Animated.View
                style={{
                  ...styles.btnSign,
                  backgroundColor: 'white',
                  opacity: this.btnOpacity,
                  transform: [{translateY: this.btnY}],
                }}>
                <Text style={styles.text}>Sign in</Text>
              </Animated.View>
            </TapGestureHandler>
            <TapGestureHandler>
              <Animated.View
                style={{
                  ...styles.btnSign,
                  backgroundColor: '#2E71DC',
                  opacity: this.btnOpacity,
                  transform: [{translateY: this.btnY}],
                }}>
                <Text style={styles.text}>Sign in with Facebook</Text>
              </Animated.View>
            </TapGestureHandler>
          </View>

          <Animated.View
            style={{
              height: height / 3,
              ...StyleSheet.absoluteFill,
              top: null,
              zIndex: this.textInputZIndex,
              opacity: this.textInputOpacity,
              justifyContent: 'center',
              transform: [{translateY: this.textInputY}],
            }}>
            <TapGestureHandler onHandlerStateChange={this.closeTextInput}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 19,
                    transform: [{rotate: concat(this.crossRotation, 'deg')}],
                  }}>
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>

            <TextInput
              placeholder="User name"
              style={styles.textInput}
              placeholderTextColor="black"
            />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor="black"
            />
            <TapGestureHandler onHandlerStateChange={this.onLoginPress}>
              <Animated.View
                style={{
                  ...styles.btnSign,
                  elevation: 2,
                }}>
                <Text style={{...styles.text, fontSize: 19}}>Sign in</Text>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnContainer: {
    height: height / 3,
    justifyContent: 'center',
    zIndex: 1,
  },
  btnSign: {
    marginHorizontal: 50,
    borderRadius: 35,
    height: 60,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
  },
  closeButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    ...StyleSheet.absoluteFillObject,
    top: -25,
    left: width / 2 - 25,
    zIndex: 4,
  },
  textInput: {
    height: 50,
    marginHorizontal: 20,
    borderRadius: 25,
    borderWidth: 0.5,
    paddingLeft: 10,
    borderColor: 'rgba(0,0,0,0.5)',
    marginVertical: 10,
  },
});
