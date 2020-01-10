import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';

import ImagePicker from 'react-native-image-picker';

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

export default class ProfileScreen extends Component {
  state = {
    photo: null,
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
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
    let { photo } = this.state;
    if (photo == null) {
      photo = {uri: "../assets/icon/Naruto.png"};
    }
    return (
      <View style={ styles.container }>
        <View>
          {
            photo && (
              <Image style={ styles.head_portrial } 
                //source={require('../assets/icon/Dragonball-Goku.png')}
                source={{ uri: photo.uri }}
              />
            )
          }
        </View>
        <View>
          <TouchableHighlight>
            <Text style={{fontSize: 18, color: 'dodgerblue', fontWeight: 'bold'}}
              onPress={this.handleChoosePhoto}>
                Change Profile Photo
            </Text>
          </TouchableHighlight>
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Goku</Text>
        </View>
        <View style={styles.balance_view}>
          <FontAwesomeIcon icon={ faDollarSign } style={styles.stars} size={20}/>
          <Text style={{fontSize: 18, justifyContent: 'center', textAlign: 'center', fontWeight: 'bold'}}>Balance:</Text>
          <Text style={styles.dollar_number}>$999.99</Text>
        </View>
        <View style={ styles.text_view }>
          <Text style={ styles.normal_text }>I'm class of 2020.</Text>
          <Text style={ styles.normal_text }>My school is Dragon Ball.</Text>
          <Text style={ styles.normal_text }>I can teach Kamehameha.</Text>
          <Text style={ styles.normal_text }>I want to learn English.</Text>
        </View>
        <View style={ styles.favorite_title }>
          <FontAwesomeIcon icon={ faStar } style={{color: 'dodgerblue'}} size={16}/>
          <Text style={{fontSize: 18, justifyContent: 'center', textAlign: 'center', fontWeight: 'bold'}}>Favorited:</Text>
        </View>

        <View style={styles.icon_banner}>
          <TouchableHighlight onPress={() => this.moveToPersonScreen('1')}>
            <Image style={styles.head_icon}
              source={users['1'].uri}
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

  text_view: {
    padding: 10,
    width: 360,
    height: 180,
  },

  normal_text: {
    fontSize: 18,
    marginTop: 24,
  },

  balance_view: {
    width: 240,
    height: 40,
    marginTop: 8,
    //textAlign: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },

  stars: {
    color: 'dodgerblue',
    justifyContent: 'center', 
    textAlign: 'center',
  },

  dollar_number: {
    color: 'forestgreen',
    justifyContent: 'center', 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },

  favorite_title: {
    width: 360,
    marginTop: 32,
    paddingLeft: 8,
    flexDirection: "row",
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
});