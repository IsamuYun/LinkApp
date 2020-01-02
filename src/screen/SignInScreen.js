import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

// import { socket } from "../socket/Socket-IO";

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeStack } from "./HomeScreen";
import SignUpScreen from "./SignUpScreen";

import io from 'socket.io-client';

const SERVER_URL = 'http://127.0.0.1:5000';

//export const socket = io(SERVER_URL, { transports: ['websocket'], jsonp: false });

export class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_name: '',
      password: '',
      message: '',
    };
    
    this.signIn = this.signIn.bind(this);

    
  }

  componentDidMount() {
    this.socket = io(SERVER_URL, { reconnection: false, transports: ['websocket'], jsonp: false });

    this.socket.on('connect', () => {
      console.log('connected')
    });

    this.socket.on("sign in response", (message) => {this.response(message)});
  }

  signIn() {
    var data = {
      "user_name": this.state.user_name, 
      "password": this.state.password
    };
    this.socket.emit("sign in", JSON.stringify(data));
  }

  response(message) {
    let data_str = JSON.stringify(message);
    console.log(data_str);
  }

  async onUserLogin() {
    // this.signIn();
    this.props.navigation.navigate("Home");
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
              { //this.state.user_name.split(' ').map((word) => word && '🍕').join(' ') 
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
  

