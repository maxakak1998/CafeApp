import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
// import BanCafe from '../../../components/BanCafe';

const TypeView = {
  SimpleRow: 0,
};

const {width, height} = Dimensions.get('window');
class DanhSachBan extends Component {
  constructor(args) {
    super(args);
    this._layoutProvider = new LayoutProvider(
      index => {
        return SimpleRow;
      },
      (type, dim) => {
        dim.height = 150;
        dim.width = width / 3 - 0.1;
      },
    );

    this.state={
        _dataProvider=new DataProvider((r1,r2)=>{
            return r1!==r2;
        }).cloneWithRows([0,1,2,3,4,5])
    }
    
  } 
  _rowRender=((type,data)=>{
      return(
          <BanCafe

              
          />
      );
  })


  render() {
    return <RecyclerListView 
    

    />;
  }
}
export default DanhSachBan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
