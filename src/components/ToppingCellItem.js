import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ToppingCellItem = props => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.data.name} </Text>
    <Text style={styles.text}> - </Text>
    <Text style={styles.text}>{props.data.size} </Text>
    <Text style={styles.text}> - </Text>
    <Text style={styles.text}>{props.data.soLuong}</Text>
  </View>
);

export default ToppingCellItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
