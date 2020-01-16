import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

// import { socket } from "../socket/Socket-IO";

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeStack } from "./HomeScreen";
import SignUpScreen from "./SignUpScreen";

import WS from '../socket/ws';
import Store from "../store/store";

import AsyncStorage from '@react-native-community/async-storage';

export class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_name: '',
      password: '',
      message: '',
    };
    
    this.signIn = this.signIn.bind(this);
    this.response = this.response.bind(this);

    
  }

  componentDidMount() {
    this.socket = WS.getSocket();
  }
  
  signIn() {
    var data = {
      "user_name": this.state.user_name, 
      "password": this.state.password
    };
    this.socket.emit("sign_in", data.user_name, data.password, this.response);
  }

  response(message) {
    const user_id = message.user_id;
    Store.storeUserId(user_id);
    if (message.e_code != 0) {
      this.setState( {message: message.e_msg} );
    }
    else {
      this.props.navigation.navigate("Home");
    }
  }

  async onUserLogin() {
    this.signIn();
  }

  onSignUp() {
    this.props.navigation.navigate("SignUp");
  }

  render() {
    return (
        <View style={ styles.container }>
          
          <View style={ styles.title_view }>
            <Text style={ {color: 'white', fontSize: 30} }>Link</Text>
          </View>
          
          <View style={ styles.textinput_view }>
            <TextInput style={ {width: 340, height: 40, fontSize: 18} }
              placeholder="Phone number or username"
              onChangeText={(user_name) => this.setState({user_name})}
              value={this.state.user_name}
            />
            <TextInput style={ {width: 340, height: 40, fontSize: 18} }
              placeholder="Password"
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              value={this.state.password}
            />
            <Button 
              title="Sign In"
              onPress={() => this.onUserLogin()}
            />
          </View>
          
          <View style={ styles.message_view }>
            <Text style={ {padding: 10, fontSize: 24} }>
              { 
                this.state.message
              }
            </Text>
          </View>
    
          <View style={ styles.sigh_up_view }>
            <Text style={ {fontSize: 20} }>
              Don't have an account?
            </Text>
            <Button
              title="Sign Up"
              onPress={ () => this.onSignUp() }
            />
          </View>
    
    
        </View>
      );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title_view: {
    width: 360,
    height: 40,
    backgroundColor: 'skyblue',
    fontSize: 30,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput_view: {
    padding: 10,
    width: 360,
    height: 120,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  message_view: {
    width: 360,
    height: 60,
    color: 'red'
  },
  sigh_up_view: {
    width: 360,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
};

export const AppNavigator = createStackNavigator(
  {
    SignIn: SignInScreen,
    Home: HomeStack,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: 'SignIn',
  }
);


  
export default createAppContainer(AppNavigator);
  

