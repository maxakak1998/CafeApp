import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
const textSize = 15;

class CategoryItem extends Component {
  render() {
    const {style, changeBackgroundCatItem, index} = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          changeBackgroundCatItem(index === 6 ? 7 : index);
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
    margin: 3,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: textSize,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
