import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, TouchableHighlight } from 'react-native';

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
            <Text style={ {color: 'white', fontSize: 30, fontWeight: 'bold'} }>Link</Text>
          </View>

          <View style={ styles.textinput_view }>
            <TextInput style={ styles.textinput }
              placeholder="Phone number"
              onChangeText={(phone_number) => this.setState({phone_number})}
              value={this.state.phone_number}
            />
            <TextInput style={ styles.textinput }
              placeholder="Username"
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