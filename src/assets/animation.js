import {LayoutAnimation} from 'react-native';
import {BaseItemAnimator} from 'recyclerlistview';
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
import Animated, {Easing} from 'react-native-reanimated';

export const MyLayoutAnimation = {
  OpenAnimation: LayoutAnimation.create(
    700,
    LayoutAnimation.Types.easeIn,
    LayoutAnimation.Properties.scaleXY,
  ),
  ChangeAnimation: LayoutAnimation.create(
    500,
    LayoutAnimation.Types.easeIn,
    LayoutAnimation.Properties.opacity,
  ),
  CloseAnimation: LayoutAnimation.create(
    500,
    LayoutAnimation.Types.easeIn,
    LayoutAnimation.Properties.opacity,
  ),
};

export function runTimingDragToDelete(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 50,
    toValue: new Value(0),
    easing: Easing.in(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        // set(config.toValue, dest),
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
export function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
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

export class ItemAnimator extends BaseItemAnimator {
  animateWillMount(atX, atY, itemIndex) {
    //This method is called before the componentWillMount of the list item in the rowrenderer
    //Fill in your logic.
    console.log('Will mount animator');
    return undefined;
  }
  animateDidMount(atX, atY, itemRef, itemIndex) {
    //This method is called after the componentDidMount of the list item in the rowrenderer
    //Fill in your logic
    // //No return
    // const {viewConfig} = itemRef;
    // const {NativeProps} = viewConfig;
    // console.log('nativeProps', NativeProps);
    // console.log('itemRef', itemRef);

    LayoutAnimation.configureNext(MyLayoutAnimation.OpenAnimation);

    console.log('Did mount animator');
  }
  animateWillUpdate(fromX, fromY, toX, toY, itemRef, itemIndex): void {
    //This method is called before the componentWillUpdate of the list item in the rowrenderer. If the list item is not re-rendered,
    //It is not triggered. Fill in your logic.
    // A simple example can be using a native layout animation shown below - Custom animations can be implemented as required.
    console.log('Will update animator');
    LayoutAnimation.configureNext(MyLayoutAnimation.ChangeAnimation);

    // console.log('ItemRefUpdate', itemRef);
    //No return
  }
  animateShift(fromX, fromY, toX, toY, itemRef, itemIndex): boolean {
    //This method is called if the the props have not changed, but the view has shifted by a certain amount along either x or y axes.
    //Note that, this method is not triggered if the props or size has changed and the animateWillUpdate will be triggered in that case.
    console.log('Will shift animator');
    //Return value is used as the return value of shouldComponentUpdate, therefore will trigger a view re-render if true.
    return false;
  }
  animateWillUnmount(atX, atY, itemRef, itemIndex): void {
    console.log('Will unmount animator');
    //This method is called before the componentWillUnmount of the list item in the rowrenderer
    //No return
    LayoutAnimation.configureNext(MyLayoutAnimation.CloseAnimation);
  }
}
