import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import WS from '../socket/ws';
import { counter } from "@fortawesome/fontawesome-svg-core";

import { NavigationEvents } from "react-navigation";

export default class PersonScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      user_name: navigation.getParam("user_name", ""),
      user_id: navigation.getParam("user_id", ""),
      head_portraits: "",
      other_uid: navigation.getParam("other_uid", ""),
      other_user_name: navigation.getParam("other_user_name", ""),
      other_head_portraits: navigation.getParam("other_head_portraits", "Yasuo.jpg"),
    };
    
    
    this.socket = WS.getSocket();
    
    
  }

  willFocus = (payload) => {
    // TODO get other user_info.
    const {navigation} = this.props;
    this.setState({user_name: navigation.getParam("user_name", "")});
    this.setState({user_id: navigation.getParam("user_id", "")});
    this.setState({head_portraits: navigation.getParam("head_portraits", "")});
    this.setState({other_uid: navigation.getParam("other_uid", "")});
    this.setState({other_user_name: navigation.getParam("other_user_name", "")});
    this.setState({other_head_portraits: navigation.getParam("other_head_portraits", "Yasuo.jpg")});
    console.log(payload);
  }

  
  componentDidMount() {
    
  }

  moveToChatScreen = async () => {
    this.props.navigation.navigate("Chat", {
      host_uid: this.state.other_uid,
      host_name: this.state.other_user_name,
      host_head_portraits: this.state.other_head_portraits,
      user_id: this.state.user_id,
      user_name: this.state.user_name,
      head_portraits: this.state.head_portraits,
    });
  }

  getUserId = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      this.setState({user_id: user_id});
    }
    catch (e) {
      console.log(e);
    }
  }

  onPay = async () => {
    // this.getPersonUid();
    this.socket.emit("increase_money", this.state.user_id, -5, function(result) {
      if (result) {
        console.log("user is pay 5 dollars.");
        this.getPersonUid();
        this.socket.emit("increase_money", this.state.other_uid, 5, function(result) {
          if (result) {
            console.log("this person get 5 dollars");
          }
        });
      }
      
    }.bind(this));
    
  }

  render() {
    const { navigation } = this.props;
    
    return (
      <View style={ styles.container }>
        <NavigationEvents
          onWillFocus={(payload) => {this.willFocus(payload)}}
        />
        <View>
          <Image style={ styles.head_portrial } 
            source={ { uri: WS.BASE_URL + this.state.other_head_portraits } }
          />
        </View>
        <View>

        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold'}}>{this.state.other_user_name}</Text>
        </View>
        <View style={ styles.button_view }>
          <TouchableHighlight
            style={ styles.submit }
            onPress={ () => this.onPay() }
          >
            <Text style={ styles.submitText }>Pay $5</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={ styles.submit }
            onPress={ () => this.moveToChatScreen() }
          >
            <Text style={ styles.submitText }>Message</Text>
          </TouchableHighlight>
        </View>
        <View style={ styles.text_view }>
          <Text style={ styles.normal_text }>I'm class of 2020.</Text>
          <Text style={ styles.normal_text }>My school is {navigation.getParam('school', 'Dragon Ball')}.</Text>
          <Text style={ styles.normal_text }>I can teach {navigation.getParam('skill', 'Kamehameha')}.</Text>
          <Text style={ styles.normal_text }>I want to learn {navigation.getParam('learn', 'English')}.</Text>
          <Text style={ styles.normal_text }>Leave a view:</Text>
          <TextInput style={ styles.review_text }
              placeholder="Leave a view"
              multiline={true}
              //onChangeText={(user_name) => this.setState({user_name})}
              //value={this.state.user_name}
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
    paddingTop: 8,
  },

  head_portrial: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 100,
  },

  button_view: {
    width: 360,
    height: 40,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },

  submit: {
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:2,
    backgroundColor:'#68a0cf',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    width: 140,
    height: 40,
  },
  submitText: {
    color:'white',
    textAlign:'center',
    fontSize: 24,
  },

  text_view: {
    padding: 10,
    width: 360,
    height: 280,
  },

  normal_text: {
    fontSize: 18,
    marginTop: 24,
  },

  review_text: {
    width: 340,
    height: 120,
    fontSize: 20,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});