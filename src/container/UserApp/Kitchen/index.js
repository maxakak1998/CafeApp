import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {firebase} from '@react-native-firebase/database';
import KitchenItem from '../../../components/KitchenItem';
const orderFb = firebase.database().ref('OrderBills');
const {width, height} = Dimensions.get('window');
class Kitchen extends Component {
  async componentDidMount() {
    let userData;

    await orderFb.on('value', snapshot => {
      if (snapshot.exists()) {
        console.log('Is Loading: ', this.state.isLoading);
        this.setState({isLoading: true});
        console.log('Is Loading: ', this.state.isLoading);
        userData = snapshot.val();
        console.log('userData :', userData);
        this.setState({isLoading: false, dataFromFB: userData});
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoading !== this.state.isLoading) {
      if (!this.state.isLoading) {
        console.log('USer data array ', Object.values(this.state.dataFromFB));
        const realData = Object.values(this.state.dataFromFB);
        const finalData = this.filteredBill(realData);
        this.setState({
          kitchenDataProvider: new DataProvider((r1, r2) => {
            return r1 !== r2;
          }).cloneWithRows(finalData),
        });
      }
    }
  }

  //lay nhung bill nao dang co order.
  filteredBill(data) {
    const result = data.reduce((acc, value) => {
      if ('Bills' in value) {
        acc.push(value);
        return acc;
      }
      return acc;
    }, []);
    console.log('RESULT AFTER FILTERED ', result);
    return result;
  }

  state = {
    dataFromFB: {},
    realData: [],
    isLoading: true,
    kitchenDataProvider: new DataProvider((r1, r2) => {
      return r1 !== r2;
    }).cloneWithRows([]),
  };

  LayoutProvider = new LayoutProvider(
    index => {
      return 0;
    },
    (type, dim) => {
      dim.height = height * 0.4;
      dim.width = width;
    },
  );

  rowRender = (type, data) => {
    return (
      <View style={{width: width}}>
        <KitchenItem resetDataSize={this.resetDataSize} data={data} />
      </View>
    );
  };

  resetDataSize = () => {
    this.setState({
      kitchenDataProvider: new DataProvider(
        (r1, r2) => r1 !== r2,
      ).cloneWithRows([]),
    });
  };
  render() {
    const size = this.state.kitchenDataProvider.getSize();
    console.log('SIZE ', size);
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={18} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            {!!size ? (
              <View style={{flex: 1}}>
                <RecyclerListView
                  dataProvider={this.state.kitchenDataProvider}
                  layoutProvider={this.LayoutProvider}
                  rowRenderer={this.rowRender}
                  forceNonDeterministicRendering={true}
                  canChangeSize
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>Trống</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
export default Kitchen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
