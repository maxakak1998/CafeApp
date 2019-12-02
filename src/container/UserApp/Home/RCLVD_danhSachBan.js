/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  Switch,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
} from 'react-native';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
import BanCafe from '../../../components/BanCafe';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {ItemAnimator, runTiming} from './../../../assets/animation';
const {
  event,
  Value,
  Clock,
  concat,
  cond,
  eq,
  set,
  block,
  Extrapolate,
  interpolate,
} = Animated;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TypeView = {
  SimpleRow: 0,
};
const floatingButtonDemsion = {
  height: 60,
  width: 60,
};

const {width, height} = Dimensions.get('window');
class DanhSachBan extends Component {
  componentDidMount() {
    console.log('tableDetail from props: ', this.props.tableDetail.lau1);
    // this.setState({tableDetail: this.props.tableDetail.lau1});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.switchActive !== this.state.switchActive) {
      let newData = [];
      const fullData =
        this.state.lauActive === 1
          ? this.props.tableDetail.lau1
          : this.props.tableDetail.lau2;
      console.log('FullData', fullData);
      if (this.state.switchActive) {
        newData = fullData.filter(table => {
          if (table.tinhTrang === 'Đang sử dụng') {
            return table;
          }
        });
      } else {
        newData = fullData.filter(table => {
          if (table.tinhTrang === 'Trống') {
            return table;
          }
        });
      }
      console.log('newData', newData);
      this.setState({
        _dataProvider: new DataProvider((r1, r2) => {
          return r1 !== r2;
        }).cloneWithRows(newData),
      });
    }
  }
  constructor(args) {
    super(args);
    this._layoutProvider = new LayoutProvider(
      index => {
        return TypeView.SimpleRow;
      },
      (type, dim) => {
        dim.height = 150;
        dim.width = width / 2 - 0.1;
      },
    );
    this.itemAnimator = new ItemAnimator();

    // tạo ra một mảng chứa số lầu tương ứng , vd có 2 lầu = > [1,2]
    // console.log(this.lauArray);
    this.state = {
      switchActive: false,
      lauActive: 1,
      _dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(this.props.tableDetail.lau1),
    };
    this.openFloatButtonValue = new Value(0);
    this.openFilterButtonValue = new Value(0);

    this.handlerFilterButtonOpen = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.openFilterButtonValue, runTiming(new Clock(), 0, 1)),
            ),
          ]),
      },
    ]);

    this.handlerFloatButtonOpen = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.openFloatButtonValue, runTiming(new Clock(), 0, 1)),
            ),
          ]),
      },
    ]);

    this.handlerFloatButtonClose = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.openFloatButtonValue, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ]);
    //```
    this.buttonScalingValue = new Value(0);
    this.buttonScalingHandler = event([
      {
        nativeEvent: ({state}) =>
          block([
            eq(state, State.BEGAN),
            set(this.buttonScalingValue, runTiming(new Clock(), 0, 2)),
          ]),
      },
    ]);
    this.filterClickHandler = ({nativeEvent}) => {
      const {state} = nativeEvent;
      if (state === State.END) {
        this.setState(prevState => ({
          switchActive:
            prevState.switchActive === prevState.switchActive
              ? !prevState.switchActive
              : prevState.switchActive,
        }));
      }
    };
    this.lau1HandlerClick = ({nativeEvent}) => {
      const {state} = nativeEvent;
      if (state === State.END) {
        const {_dataProvider} = this.state;
        const {tableDetail: tableDetailProps} = this.props;
        const {lau1: lau1Data} = tableDetailProps;
        if (_dataProvider.getAllData() !== lau1Data) {
          console.log('Yes ! Change it please ');
          this.setState({
            lauActive: 1,
            _dataProvider: new DataProvider((r1, r2) => {
              return r1 !== r2;
            }).cloneWithRows(lau1Data),
          });
        }
      }
    };

    this.scalingButton = interpolate(this.buttonScalingValue, {
      inputRange: [0, 1, 2],
      outputRange: [1, 1.5, 1],
      extrapolate: Extrapolate.CLAMP,
    });

    this.transClose = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.transOpen = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });
    this.transScalingOpen = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.lau1ButtonX = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [100, -(width / 6)],
      extrapolate: Extrapolate.CLAMP,
    });

    this.lau1ButtonY = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [0, height / 3],
      extrapolate: Extrapolate.CLAMP,
    });

    this.lau2ButtonY = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [100, -40],
      extrapolate: Extrapolate.CLAMP,
    });

    this.lau2ButtonX = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [0, 50],
      extrapolate: Extrapolate.CLAMP,
    });

    this.rotateClose = interpolate(this.openFloatButtonValue, {
      inputRange: [0, 1],
      outputRange: [0, 180],
      extrapolate: Extrapolate.CLAMP,
    });
  }
  switchHandler = value => {
    this.setState(prevState => ({
      switchActive: prevState.switchActive === value ? !value : value,
    }));
  };

  lau2HandlerClick = ({nativeEvent}) => {
    const {state} = nativeEvent;

    if (state === State.END) {
      this.buttonScalingValue = runTiming(new Clock(), 0, 2);
      const {_dataProvider} = this.state;
      const {tableDetail: tableDetailProps} = this.props;
      const {lau2: lau2Data} = tableDetailProps;

      console.log('Lau 2');
      // console.log('Data in state', tableDetailState);
      // console.log('Data in props', tableDetailProps);
      console.log('Data in lau 2', lau2Data);

      // this.setState({
      //   _dataProvider: new DataProvider((r1, r2) => {
      //     return r1 !== r2;
      //   }).cloneWithRows(lau2Data),
      // });
      console.log('dataProvider', _dataProvider.getAllData());
      if (_dataProvider.getAllData() !== lau2Data) {
        console.log('Yes ! Change it please ');
        this.setState({
          lauActive: 2,
          _dataProvider: new DataProvider((r1, r2) => {
            return r1 !== r2;
          }).cloneWithRows(lau2Data),
        });
      }
    }
  };

  _rowRender = (type, data) => {
    const {navigation} = this.props;
    return (
      <BanCafe
        navigation={navigation}
        tinhTrang={data.tinhTrang}
        soBan={data.soBan}
      />
    );
  };

  render() {
    // console.log('Render');
    const textFilter =
      this.state.switchActive === true ? 'Đang sử dụng' : 'Trống';
    const widthTextFilter = this.state.switchActive === true ? 6 : 25;
    return (
      <View style={styles.container}>
        <RecyclerListView
          dataProvider={this.state._dataProvider}
          rowRenderer={this._rowRender}
          layoutProvider={this._layoutProvider}
          itemAnimator={this.itemAnimator}
          optimizeForInsertDeleteAnimations={true}
        />

        <Animated.Text
          style={{
            ...styles.textFilter,
            alignSelf: 'flex-end',
            position: 'absolute',
            bottom: 130,
            right: widthTextFilter,
            opacity: this.transScalingOpen,
          }}>
          {textFilter}
        </Animated.Text>
        <TapGestureHandler onHandlerStateChange={this.handlerFilterButtonOpen}>
          <Animated.View
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              bottom: 100,
              transform: [{scale: this.transScalingOpen}],
              right: 15,
            }}>
            <TapGestureHandler
              style={{flex: 1}}
              onHandlerStateChange={this.filterClickHandler}>
              <Switch
                style={{
                  flex: 1,
                  transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                }}
                value={this.state.switchActive}
                onValueChange={this.switchHandler}
              />
            </TapGestureHandler>
          </Animated.View>
        </TapGestureHandler>

        <TapGestureHandler onHandlerStateChange={this.handlerFloatButtonOpen}>
          <Animated.View
            style={{
              ...styles.floatingButton,
              transform: [{translateX: this.transOpen}],
            }}>
            <Animated.Text
              style={{
                top: -3,
                color: 'white',
                fontWeight: '300',
                fontSize: 50,
              }}>
              +
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>

        <TapGestureHandler onHandlerStateChange={this.handlerFloatButtonClose}>
          <Animated.View
            style={{
              ...styles.floatingButton,

              backgroundColor: 'red',
              transform: [{translateX: this.transClose}],
            }}>
            <Animated.Text
              style={{
                fontWeight: '300',
                fontSize: 30,
                transform: [{rotate: concat(this.rotateClose, 'deg')}],
                color: 'white',
              }}>
              X
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>

        <TapGestureHandler onHandlerStateChange={this.lau1HandlerClick}>
          <Animated.View
            style={{
              ...styles.floatingButtonLau,
              bottom: height / 2,
              alignSelf: 'flex-end',
              backgroundColor: this.state.lauActive === 1 ? 'pink' : 'white',
              transform: [
                {
                  translateX: this.lau1ButtonX,
                  translateY: this.lau1ButtonY,
                  scale: this.scalingButton,
                },
              ],
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Lầu 1
            </Text>
          </Animated.View>
        </TapGestureHandler>
        <TapGestureHandler onHandlerStateChange={this.lau2HandlerClick}>
          <Animated.View
            style={{
              ...styles.floatingButtonLau,
              alignSelf: 'center',
              backgroundColor: this.state.lauActive === 2 ? 'pink' : 'white',
              transform: [
                {translateY: this.lau2ButtonY, translateX: this.lau2ButtonX},
              ],
            }}>
            <Text style={{top: -3, fontWeight: 'bold', fontSize: 15}}>
              Lầu 2
            </Text>
          </Animated.View>
        </TapGestureHandler>
      </View>
    );
  }
}
export default DanhSachBan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  crossLine: {
    height: 3,
    backgroundColor: 'blue',
    marginHorizontal: 5,
  },
  floatingButton: {
    position: 'absolute',
    height: floatingButtonDemsion.height,
    width: floatingButtonDemsion.width,
    backgroundColor: 'blue',
    borderRadius: floatingButtonDemsion.height / 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    bottom: 20,
    right: 20,
  },
  textFilter: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  floatingButtonLau: {
    position: 'absolute',
    height: floatingButtonDemsion.height - 5,
    width: floatingButtonDemsion.width - 5,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: floatingButtonDemsion.height - 5 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
