import React, { Component } from 'react';

import { AppNavigator } from './src/screen/SignInScreen';

import { createAppContainer } from 'react-navigation';

import AsyncStorage from '@react-native-community/async-storage';

const AppContainer = createAppContainer(AppNavigator);

import WS from './src/socket/ws';

export default class App extends Component {
  constructor(props) {
    super(props);
    WS.init();
  }

  async saveSocket(socket, connection) {
    try {
      await AsyncStorage.setItem(socket, connection);
    }
    catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  componentDidMount() {
    
    //var socket = 
    //this.saveSocket('socket', socket);
  }

  render() {
    return <AppContainer />;
  }
  
}


