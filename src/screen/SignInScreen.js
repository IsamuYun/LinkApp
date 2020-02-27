import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, TouchableHighlight } from 'react-native';

// import { socket } from "../socket/Socket-IO";

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeStack } from "./HomeScreen";
import SignUpScreen from "./SignUpScreen";

import WS from '../socket/ws';
import Store from "../store/store";
import { ChatScreen } from './ChatScreen';

export class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_name: '',
      password: '',
      message: '',
    };
    
    this.socket = WS.getSocket();
    this.socket.on("sign_in_res", (message) => {this.response(message)});
  }

  componentDidMount() {
    
  }
  
  signIn = () => {
    var data = {
      "user_name": this.state.user_name, 
      "password": this.state.password
    };
    this.socket.emit("sign_in", data.user_name, data.password);
  }

  response = (message) => {
    const user_id = message.user_id;
    Store.storeUserId(user_id);
    Store.storeUserName(message.user_name);
    Store.storeHeadPortraits(message.head_portraits)
    if (message.e_code != 0) {
      this.setState( {message: message.e_msg} );
    }
    else {
      console.log("Sign in successful.");
      this.props.navigation.navigate("Home", {
        user_id: user_id,
        user_name: message.user_name,
        head_portraits: message.head_portraits,
      });
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
            <TextInput style={ styles.textinput }
              placeholder="Phone number or username"
              onChangeText={(user_name) => this.setState({user_name})}
              value={this.state.user_name}
            />
            <TextInput style={ styles.textinput }
              placeholder="Password"
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              value={this.state.password}
            />
            <TouchableHighlight
              style={ styles.submit }
              onPress={ () => this.onUserLogin() }
            >
              <Text style={ {color: 'white', fontSize: 24, fontWeight: 'bold'} }>Sign In</Text>
            </TouchableHighlight>
          </View>
          
          <View style={ styles.sigh_up_view }>
            <Text style={ {fontSize: 20} }>
              Don't have an account?
            </Text>
            <TouchableHighlight
              style={ styles.submit }
              onPress={ () => this.onSignUp() }
            >
              <Text style={ {color: 'white', fontSize: 24, fontWeight: 'bold'} }>Sign Up</Text>
            </TouchableHighlight>
          </View>

          <View style={ styles.message_view }>
            <Text style={ {padding: 10, fontSize: 24} }>
              { 
                this.state.message
              }
            </Text>
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
    width: '90%',
    height: 48,
    backgroundColor: 'skyblue',
    fontSize: 30,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput_view: {
    width: '90%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textinput: {
    width: '90%',
    height: 40,
    fontSize: 18,
  },

  message_view: {
    width: '90%',
    color: 'red'
  },
  sigh_up_view: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  submit: {
    marginRight:10,
    marginLeft:10,
    paddingTop:2,
    backgroundColor:'#68a0cf',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
};

export const AppNavigator = createStackNavigator(
  {
    SignIn: SignInScreen,
    Home: HomeStack,
    SignUp: SignUpScreen,
    Chat: ChatScreen,
  },
  {
    initialRouteName: 'SignIn',
  }
);
  
export default createAppContainer(AppNavigator);
  

