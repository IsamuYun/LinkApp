import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import WS from '../socket/ws';
import { counter } from "@fortawesome/fontawesome-svg-core";

export default class PersonScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      user_name: "",
      user_id: "",
      other_uid: navigation.getParam("other_uid", ''),
    };
    this.socket = WS.getSocket();
    this.getUserId(); 
  }

  
  componentDidMount() {
  }

  getPersonUid = () => {
    
    const { navigation } = this.props;
    console.log("This person's uid: " + navigation.getParam("other_uid", ""));
    console.log("This person's head_portraits: " + navigation.getParam("other_head_portraits", ""));
  }

  moveToHomeScreen() {
    this.props.navigation.navigate("Home");
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

  getOtherUser = () => {
    
      const other_uid = AsyncStorage.getItem("other_uid");
      this.setState({other_uid});
      const other_head_portraits = AsyncStorage.getItem("other_head_portraits");
      this.setState({other_head_portraits});
  }

  onPay = async () => {
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
        <View>
          <Image style={ styles.head_portrial } 
            source={ {uri: WS.BASE_URL + navigation.getParam("other_head_portraits", '')} }
          />
        </View>
        <View>

        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold'}}>{navigation.getParam('name', 'GoKu')}</Text>
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