import React, { Component } from 'react';

import { AppNavigator } from './src/screen/SignInScreen';

import { createAppContainer } from 'react-navigation';

const AppContainer = createAppContainer(AppNavigator);

import WS from './src/socket/ws';

export default class App extends Component {
  constructor(props) {
    super(props);
    WS.init();
  }

  componentDidMount() {
  }

  render() {
    return <AppContainer />;
  }
  
}


