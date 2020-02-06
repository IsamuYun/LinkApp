import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import ProfileScreen from './ProfileScreen';
import PersonScreen from './PersonScreen';
import { ChatScreen } from './ChatScreen';
import ConversationScreen from './ConversationScreen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faComments, faIdBadge, faUser } from '@fortawesome/free-regular-svg-icons';

import WS from '../socket/ws';
import { counter } from "@fortawesome/fontawesome-svg-core";

import Store from "../store/store";

import { NavigationEvents } from "react-navigation";

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;

    this.state = {
      user_id: navigation.getParam("user_id", ''),
      user: {},
      user_name: navigation.getParam("user_name", ""),
      head_portraits: navigation.getParam("head_portraits", ""),
      teacher_list: [],
      student_list: [],
    }

    this.socket = WS.getSocket();
    this.socket.on("user_info_res", (message) => {this.responseUserInfo(message)});
    this.socket.on("teacher_list_res", (list) => {this.responseTeacherList(list)});
    this.socket.on("student_list_res", (list) => {this.responseStudentList(list)});
    
    
  }
  
  willFocus = (payload) => {
    console.log("home will focus", payload);
    
    console.log("Focus name: " + this.state.user_name);
    console.log("Focus uid: " + this.state.user_id);
    console.log("Focus head_portrait: " + this.state.head_portraits);
    this.getUserInfo();
  } 
  

  response(message) {
    if (message.code == 0) {
      this.setState({ uri: message.data});
    }
  }

  componentDidMount() {
  }

  getUserInfo = () => {
    this.socket.emit("get_user_info", this.state.user_id);
  }

  responseUserInfo = (message) => {
    if (message.code == 0) {
      this.setState({user: message.data});
      console.log("User Info:");
      console.log(this.state.user);
    }
    else {
      console.log(message.message);
    }
  }

  responseTeacherList = (list) => {
    if (list.code == 0) {
      const teacher_list = list.user_list;
      console.log("Teacher List:");
      this.setState({teacher_list: teacher_list});
    }
  }

  responseStudentList = (list) => {
    if (list.code == 0) {
      const student_list = list.user_list;
      console.log("Student List:");
      this.setState({student_list: student_list});
    }
  }

  moveToPersonScreen = (user) => {
    if (user === null) {
      return;
    }
    
    Store.storeOtherUserId(user.user_id);
    Store.storeOtherHeadPortraits(user.head_portraits);

    this.props.navigation.navigate("Person", {
      other_user_name: user.user_name,
      other_uid: user.user_id,
      other_head_portraits: user.head_portraits,
      user_id: this.state.user_id,
      user_name: this.state.user_name,
      head_portraits: this.state.head_portraits,
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={(payload) => {this.willFocus(payload)}}
        />
        <View style={styles.header}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome, { this.state.user_name }</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Here are some people we</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Linked with you</Text>
          <View style={ styles.header_banner }></View>
        </View>
        
        <View style={ styles.student_title }>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who can teach...</Text>
          <View style={ styles.blue_banner }></View>
        </View>
        
        <View style={styles.icon_banner}>
          {
            this.state.teacher_list.map((user, index) => {
              if (index >= 0 && index < this.state.teacher_list.length && index < 4) {
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
            this.state.teacher_list.map((user, index) => {
              if (index >= 4 && index < this.state.teacher_list.length && index < 8) {
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
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who want to learn...</Text>
          <View style={styles.blue_banner}></View>
        </View>

        <View style={styles.icon_banner}>
          {
            this.state.student_list.map((user, index) => {
              if (index >= 0 && index < this.state.student_list.length && index < 4) {
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
  Conversation: {
    screen: ConversationScreen,
    navigationOptions: {
      title: 'Session',
      tabBarLabel: 'Session',
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
  },
});
