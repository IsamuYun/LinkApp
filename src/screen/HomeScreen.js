import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import ProfileScreen from './ProfileScreen';
import PersonScreen from './PersonScreen';
import ChatScreen from './ChatScreen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faComments, faIdBadge, faUser } from '@fortawesome/free-regular-svg-icons';

import { getUserId } from "../store/store";
import AsyncStorage from "@react-native-community/async-storage";
// import AsyncStorage from '@react-native-community/async-storage';

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


export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.user_id = '';
  }

  componentDidMount() {
    this.getUserId();
  }

  async getUserId() {
    this.user_id = await AsyncStorage.getItem("user_id");
  }  

  

  moveToPersonScreen = (id) => {
    this.props.navigation.navigate("Person", {
      uri: users[id].uri,
      name: users[id].name,
      school: users[id].school,
      skill: users[id].skill,
      learn: users[id].learn,
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Here are some people we</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Linked with you</Text>
          <View style={styles.header_banner}></View>
        </View>
        
        <View style={styles.student_title}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who want to learn...</Text>
          <View style={styles.blue_banner}></View>
        </View>
        
        <View style={styles.icon_banner}>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('1')}>
            <Image style={styles.head_icon}
              source={users['1'].uri}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('2')}>
          
          <Image style={styles.head_icon}
            source={users['2'].uri}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('3')}>
          
          <Image style={styles.head_icon}
            source={users['3'].uri}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('4')}>
          
          <Image style={styles.head_icon}
            source={users['4'].uri}
          />
          </TouchableHighlight>
          <Button style={styles.head_button}
            title="More"

          />
        </View>

        <View style={styles.student_title}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>People who can teach...</Text>
          <View style={styles.blue_banner}></View>
        </View>

        <View style={styles.icon_banner}>
        <TouchableHighlight onPress={() => this.moveToPersonScreen('5')}>
          
          <Image style={styles.head_icon}
            source={users['5'].uri}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('6')}>
          
          <Image style={styles.head_icon}
            source={users['6'].uri}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('7')}>
          
          <Image style={styles.head_icon}
            source={users['7'].uri}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('8')}>
          
          <Image style={styles.head_icon}
            source={users['8'].uri}
          />
          </TouchableHighlight>
          <Button style={styles.head_button}
            title="More"

          />
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
    width: 72,
    height: 72,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
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
