import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
const textSize = 18;

class CategoryItem extends Component {
  render() {
    const {style, changeBackgroundCatItem, index} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          changeBackgroundCatItem(index);
        }}
        style={{flex: 1}}>
        <View style={{...styles.container, ...style}}>
          <Text style={styles.text}>{this.props.data}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: textSize,
    color: 'black',
    textAlign: 'center',
  },
});
