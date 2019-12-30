import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';



export default class PersonScreen extends Component {
  moveToHomeScreen() {
    this.props.navigation.navigate("Home");
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is Person screen.</Text>
        <Button 
          title="Back to Home"
          onPress={() => this.moveToHomeScreen()}
        />
      </View>
    );
  }
}