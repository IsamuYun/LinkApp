import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';

export default class ChatScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is Chat Screen.</Text>
      </View>
    );
  }
}