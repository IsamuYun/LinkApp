import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import WS from '../socket/ws';
import Store from '../store/store';

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_name: '',
      phone_number: '',
      password: '',
      message: '',
      user_id: '',
    };

    this.socket = WS.getSocket();

    this.socket.on("sign_up_response", (message) => {this.response(message)});
  }

  componentDidMount() {
    
  }

  signUp() {
    var data = {
      "user_name": this.state.user_name,
      "phone_num": this.state.phone_number,
      "password": this.state.password,
    };
    this.socket.emit("sign_up", JSON.stringify(data));
  }

  response(message) {
    this.setState({message: message.e_msg});
    this.setState({user_id: message.user_id});
    
    Store.storeUserId(message.user_id);
    Store.storeUserName(message.user_name);
    Store.storeHeadPortraits(message.head_portraits);

    

    if (message.e_code == 0) {
      this.props.navigation.navigate("Home", {
        user_id: message.user_id,
        user_name: message.user_name,
        head_portraits: message.head_portraits,
      });
    }
    
  }

  async onSignUp() {
    this.signUp();
  }

  render() {
    return (
        <View style={ styles.container }>
          
          <View style={ styles.title_view }>
            <Text style={ {color: 'white', fontSize: 30} }>Link</Text>
          </View>

          <View style={ styles.small_title_view }>
            <Text>Create your account</Text>
          </View>
          
          <View style={ styles.textinput_view }>
            <TextInput style={ {width: 340, height: 40, fontSize: 18} }
              placeholder="Phone number"
              onChangeText={(phone_number) => this.setState({phone_number})}
              value={this.state.phone_number}
            />
            <TextInput style={ {width: 340, height: 40, fontSize: 18} }
              placeholder="Username"
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
              title="Sign Up"
              onPress={() => this.onSignUp()}
            />
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
    width: 360,
    height: 40,
    backgroundColor: 'skyblue',
    fontSize: 30,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small_title_view: {
    width: 360,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput_view: {
    padding: 10,
    width: 360,
    height: 160,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  sigh_up_view: {
    width: 360,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },

  message_view: {
    width: 360,
    height: 60,
    color: 'red'
  },
});