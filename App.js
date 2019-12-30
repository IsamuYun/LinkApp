import React, { Component } from 'react';

import { AppNavigator } from './src/screen/SignInScreen';

import { createAppContainer } from 'react-navigation';

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <AppContainer />;
  }
  
}


