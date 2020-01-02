import React, { Component } from 'react';

import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

import io from 'socket.io-client';

const SERVER_URL = 'http://127.0.0.1:5000';

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      user_name: '',
      phone_number: '',
      password: ''
    };
  }

  componentDidMount() {
    this.socket = io(SERVER_URL, { reconnection: false, transports: ['websocket'], jsonp: false });

    this.socket.on('connect', () => {
      console.log('connected')
    });

    this.socket.on("sign up response", (message) => {this.response(message)});
  }

  signUp() {
    var data = {
      "user_name": this.state.user_name,
      "phone_number": this.state.phone_number,
      "password": this.state.password
    };
    this.socket.emit("sign up", JSON.stringify(data));
  }

  response(message) {
    let data_str = JSON.stringify(message);
    console.log(data_str);
    this.props.navigation.navigate("Home");
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
  }
});