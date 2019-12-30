import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import ProfileScreen from './ProfileScreen';
import PersonScreen from './PersonScreen';
import ChatScreen from './ChatScreen';

export class HomeScreen extends Component {
  
  moveToPersonScreen = () => {
    this.props.navigation.navigate("Person");
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
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
            <Image style={styles.head_icon}
              source={require('../assets/icon/Amnesia-anime.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Avatar-The-Last-Airbender.png')}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Bleach-anime.png')}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Fairy-Tail.png')}
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
        <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Dragonball-Goku.png')}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Fullmetal-Alchemist.png')}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Inuyasha.png')}
          />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.moveToPersonScreen()}>
          
          <Image style={styles.head_icon}
            source={require('../assets/icon/Naruto.png')}
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
  Home: HomeScreen,
  Person: PersonScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen
});