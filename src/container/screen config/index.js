import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import LoginScreen from '../Login/index';
import HomeScreen from './../UserApp/Home/index';
import Animated, {Easing} from 'react-native';
import App from './../../../App';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import OrderScreen from './../UserApp/Order/index';
import {RotationGestureHandler} from 'react-native-gesture-handler';
import Kitchen from './../UserApp/Kitchen/index';
const UserStack = createStackNavigator(
  {
    Home: HomeScreen,
    Order: OrderScreen,

    Kitchen: Kitchen,
  },
  {
    headerMode: 'none',
  },
);

// const AdminStack = createStackNavigator({});

const SwitchStack = createAnimatedSwitchNavigator(
  {
    Login: LoginScreen,
    UserApp: UserStack,
    // AdminApp: AdminStack,
  },
  {
    initialRouteName: 'Login',
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={400} interpolation="easeIn" />
        <Transition.In
          type="fade"
          durationMs={1000}
          interpolation="easeInOut"
        />
      </Transition.Together>
    ),
  },
);

const AppContainer = createAppContainer(UserStack);

const RootApp = () => {
  return <AppContainer />;
};

export default RootApp;
