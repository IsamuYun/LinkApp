import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import ProfileScreen from './ProfileScreen';
import PersonScreen from './PersonScreen';
import ChatScreen from './ChatScreen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faComments, faIdBadge, faUser } from '@fortawesome/free-regular-svg-icons';

import AsyncStorage from "@react-native-community/async-storage";

import WS from '../socket/ws';
import { counter } from "@fortawesome/fontawesome-svg-core";

import Store from "../store/store";
import { isThisTypeNode } from "typescript";

const users = {
  1: {
    uri: require('../assets/icon/Amnesia-anime.png'),
    name: 'Heroine',
    school: 'Amnesia',
    skill: 'Cooking',
    learn: 'Psychology',
  },
  2: {
    uri: require('../assets/icon/Avatar-The-Last-Airbender.png'),
    name: 'Sokka',
    school: 'the Last Airbender',
    skill: 'Karate',
    learn: 'Magic',
  },
  3: {
    uri: require('../assets/icon/Bleach-anime.png'),
    name: 'Ichigo Kurosaki',
    school: 'Karakura High School',
    skill: 'Swordmanship',
    learn: 'Japanese',
  },
  4: {
    uri: require('../assets/icon/Fairy-Tail.png'),
    name: 'Natsu Dragneel',
    school: 'Fairy Tail',
    skill: 'Fire Magic',
    learn: 'Water Magic',
  },
  5: {
    uri: require('../assets/icon/Dragonball-Goku.png'),
    name: 'GoKu',
    school: 'Dragon Ball',
    skill: 'Kamehameha',
    learn: 'English',
  },
  6: {
    uri: require('../assets/icon/Fullmetal-Alchemist.png'),
    name: 'Edward',
    school: 'Fullmetal-Alchemist',
    skill: 'Alchemy',
    learn: 'Cooking',
  },
  7: {
    uri: require('../assets/icon/Inuyasha.png'),
    name: 'Inuyasha',
    school: 'Kagome',
    skill: 'Swordmanship',
    learn: 'Archery',
  },
  8: {
    uri: require('../assets/icon/Naruto.png'),
    name: 'Naruto',
    school: 'Team Kakashi',
    skill: 'Rasengan',
    learn: 'Flying Thunder God Slash',
  }
};

const S_URL = "http://172.31.99.189:5000/";

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      user: null,
      user_list: [],
      nickname: '',
    }

    this.socket = WS.getSocket();
    this.socket.on("user_info_res", (message) => {this.responseUserInfo(message)});
  }

  

  response(message) {
    if (message.code == 0) {
      this.setState({ uri: message.data});
    }
  }

  componentDidMount() {
    this.getUserId();
  }

  getUserId = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      this.setState({user_id});
      this.socket.emit("get_user_info", user_id);
    }
    catch (e) {
      console.log(e);
    }
  }

  responseUserInfo = (message) => {
    if (message.code == 0) {
      this.setState({user: message.data});
      this.setState({nickname: message.data.nickname});
      console.log("User Info:");
      console.log(this.state.user);

      Store.storeHeadPortraits(this.state.user.head_portraits);
      
      const user_list = message.user_list;
      this.setState({user_list: user_list});
    }
    else {
      console.log(message.message);
    }
  }

  moveToPersonScreen = (user) => {
    if (user === null) {
      return;
    }
    console.log(user);
    
    Store.storeOtherUserId(user.user_id);
    Store.storeOtherHeadPortraits(user.head_portraits);


    this.props.navigation.navigate("Person", {
      name: user.nickname,
      other_uid: user.user_id,
      other_head_portraits: user.head_portraits,
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome, { this.state.nickname }</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Here are some people we</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Linked with you</Text>
          <View style={ styles.header_banner }></View>
        </View>
        
        <View style={ styles.student_title }>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who want to learn...</Text>
          <View style={ styles.blue_banner }></View>
        </View>
        
        <View style={styles.icon_banner}>
          {
            this.state.user_list.map((user, index) => {
              if (index > 14 && index < this.state.user_list.length && index < 19) {
                return (
                  <TouchableHighlight onPress={() => this.moveToPersonScreen(user)}>
                    <Image style={styles.head_icon}
                      source={ {uri: WS.BASE_URL + user.head_portraits} }
                    />
                  </TouchableHighlight>
                );
              }
            })
          }          
        </View>
        
        <View style={styles.icon_banner}>
          {
            this.state.user_list.map((user, index) => {
              if (index > 10 && index < this.state.user_list.length && index < 15) {
                return (
                  <TouchableHighlight onPress={() => this.moveToPersonScreen(user)}>
                    <Image style={styles.head_icon}
                      source={ {uri: WS.BASE_URL + user.head_portraits} }
                    />
                  </TouchableHighlight>
                );
              }
            })
          }    
            
        </View>



        
        <View style={styles.student_title}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who can teach...</Text>
          <View style={styles.blue_banner}></View>
        </View>

        <View style={styles.icon_banner}>
          {
            this.state.user_list.map((user, index) => {
              if (index > 0 && index < this.state.user_list.length && index < 5) {
                return (
                  <TouchableHighlight onPress={() => this.moveToPersonScreen(user)}>
                    <Image style={styles.head_icon}
                      source={ {uri: WS.BASE_URL + user.head_portraits} }
                    />
                  </TouchableHighlight>
                );
              }
            })
          }
          
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 10
  },
  header_banner: {
    width: 390,
    height: 4,
    backgroundColor: 'darkorange'
  },
  student_title: {
    marginTop: 30,
    padding: 10,
  },
  blue_banner: {
    width: 390,
    height: 3,
    backgroundColor: 'dodgerblue',
  },
  icon_banner: {
    flexDirection: 'row',
    marginLeft: 10,
    height: 120,
    width: 390,
  },
  head_icon: {
    width: 96,
    height: 96,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 100,
    margin: 1,
  },
  head_button: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
  }
});

export const HomeStack = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => {
        return <FontAwesomeIcon icon={ faLink } color={ tintColor } size={20}/>;
      },
    },
  },
  Person: {
    screen: PersonScreen,
    navigationOptions: {
      title: 'Person',
      tabBarLabel: 'Person',
      tabBarIcon: ({tintColor}) => {
        return <FontAwesomeIcon icon={ faIdBadge } color={ tintColor } size={20}/>;
      }
    },
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      title: 'Chat',
      tabBarLabel: 'Chat',
      tabBarIcon: ({tintColor}) => {
        return <FontAwesomeIcon icon={ faComments } color={ tintColor } size={20}/>;
      }
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profile',
      tabBarLabel: 'Profile',
      tabBarIcon: ({tintColor}) => {
        return <FontAwesomeIcon icon={ faUser } color={ tintColor } size={20}/>;
      }
    },
  }
});
