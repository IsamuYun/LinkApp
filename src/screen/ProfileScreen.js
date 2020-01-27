import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';

import ImagePicker from 'react-native-image-picker';
import WS from '../socket/ws';

import AsyncStorage from '@react-native-community/async-storage';
import Store from "../store/store";

import { NavigationEvents } from "react-navigation";

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
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      photo: null,
      message: "",
      user_id: "",
      server_file_name: "",
      head_portraits: navigation.getParam("head_portraits", "Yasuo.jpg"),
      user: {
        money: 0,
        user_name: "",
        class_name: "",
        school: "",
        skill: "",
        lesson: "",
      },
      class_name: "",
      school: "",
      skill: "",
      lesson: "",
    }

    this.socket = WS.getSocket();
    this.base64 = "";
  }

  componentDidMount() {
    this.getUserId();
    
    setTimeout(() => {
      this.getUser();
    }, 1000);

    // this.getMoney();
    this.getHeadPortraits();

    this.socket.on("read_chunk_response", (message) => {this.response(message)});
    this.socket.on("transfer_response", (message) => {this.transferResponse(message)});
    this.socket.on("single_user_res", (message) => {this.userResponse(message)});
    
  }

  response(message) {
    if (message.code == 0) {
      this.setState({ photo: {uri: message.data} });
    }
  }

  transferResponse(message) {
    if (message.code == 0) {
      const {photo} = this.state;
      this.writeFile(message.server_file_name, 0, photo.data);
    } 
  }

  userResponse(message) {
    if (message.code == 0) {
      this.setState({user: message.data});
      console.log("Get single user info:");
      console.log(this.state.user);
      if (this.state.user.class_name && this.state.class_name === "") {
        this.setState({class_name: this.state.user.class_name});
      }
      if (this.state.user.school && this.state.school === "") {
        this.setState({school: this.state.user.school});
      }
      if (this.state.user.skill && this.state.skill === "") {
        this.setState({skill: this.state.user.skill});
      }
      if (this.state.user.lesson && this.state.lesson === "") {
        this.setState({lesson: this.state.user.lesson});
      }
    }
  }

  getUserId = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      
      this.setState({user_id});
    }
    catch (e) {
      console.log(e.message);
    }
  }

  getHeadPortraits = async () => {
    try {
      const head_portraits = await AsyncStorage.getItem("head_portraits");
      this.setState({head_portraits});
    }
    catch (e) {
      console.log(e.message);
    }
  }

  getMoney = async () => {
    this.socket.emit("get_money", this.state.user_id, function(money) {
      this.setState({money});
    }.bind(this));
  }

  getUser = () => {
    this.socket.emit("get_single_user", this.state.user_id); 
  }
  
  handleChoosePhoto = async () => {
    const options = {
      noData: false,
      storageOptions: {
        skipBackup: true,
      },
    }

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.uri) {
        this.setState({ photo: response });
        
        this.startTransfer(response.fileName, response.fileSize);
      }
    });
  };

  writeFile(filename, offset, data) {
    const user_id = this.state.user_id;
    this.socket.emit("write_chunk", filename, offset, data, user_id, function(result) {
      if (result) {
        console.log("file upload success.");
        this.setState({head_portraits: filename});
        Store.storeHeadPortraits(filename);
      }
      else {
        console.log("file upload failed.");
      }
    }.bind(this));
  }

  readFile(filename) {
    this.socket.emit("read_chunk", filename, function(result) {
      if (result) {
        console.log("file read success");
      }
      else {
        console.log("file read failed");
      }
    });
  }

  startTransfer(fileName, fileSize) {
    if (fileName === null || fileSize === 0) {
      console.log("No file need to upload.");
      return false;
    } 
    this.socket.emit("start_transfer", fileName, fileSize, function(serverFileName) {
      if (!serverFileName) {
        return false;
      }
      this.server_file_name = serverFileName;
    }.bind(this));
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

  onUpdateProfile = async () => {
    console.log("Class name: " + this.state.class_name);
    console.log("School: " + this.state.school);
    console.log("Skills: " + this.state.skill);
    console.log("Lessons: " + this.state.lesson);

    let user_info = {
      user_id: this.state.user_id,
      class_name: this.state.class_name,
      school: this.state.school,
      skill: this.state.skill,
      lesson: this.state.lesson
    };

    this.socket.emit("update_profile", JSON.stringify(user_info), (result) => {
      if (result) {
        console.log("Update info successful");
      }
      else {
        console.log("Update info failed.");
      }
    });
  }

  render() {
    const { photo } = this.state;
    let user_head_portraits;
    if (this.state.head_portraits) {
      user_head_portraits = <Image style={ styles.head_portrial } source={ { uri: WS.BASE_URL + this.state.head_portraits } } />;
    }
    else {
      user_head_portraits = <Image style={ styles.head_portrial } source={require('../assets/icon/Dragonball-Goku.png')} />;
    }
    return (
      <View style={ styles.container }>
        <View>
          { user_head_portraits }
        </View>
        <View>
          <TouchableHighlight onPress={ () => {this.handleChoosePhoto()} }>
            <Text style={{fontSize: 18, color: 'dodgerblue', fontWeight: 'bold'}}>
                Change Profile Photo
            </Text>
          </TouchableHighlight>
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ this.state.user.user_name }</Text>
        </View>
        <View style={styles.balance_view}>
          <Text style={{fontSize: 18, justifyContent: 'center', textAlign: 'center', fontWeight: 'bold'}}>Balance:</Text>
          <Text style={styles.dollar_number}>{ this.state.user.money }</Text>
        </View>
        <View style={ styles.text_view }>
          <Text style={ styles.normal_text }>I'm class of </Text>
          <TextInput style={ {width: 340, height: 32, fontSize: 18} }
              placeholder="Class"
              onChangeText={(text) => this.setState({class_name: text})}
              value={ this.state.class_name }
          />
          <Text style={ styles.normal_text }>My school is </Text>
          <TextInput style={ {width: 340, height: 32, fontSize: 18} }
              placeholder="School"
              onChangeText={(text) => this.setState({school: text})}
              value={ this.state.school }
          />
          <Text style={ styles.normal_text }>I can teach</Text>
          <TextInput style={ {width: 340, height: 32, fontSize: 18} }
              placeholder="Skill"
              onChangeText={(text) => this.setState({skill: text})}
              value={ this.state.skill }
          />
          <Text style={ styles.normal_text }>I want to learn</Text>
          <TextInput style={ {width: 340, height: 32, fontSize: 18} }
              placeholder="Lesson"
              onChangeText={(text) => this.setState({lesson: text})}
              value={ this.state.lesson }
          />
        </View>
        <View>
          <Button 
              title="Update"
              onPress={() => this.onUpdateProfile()}
          />
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
    height: 340,
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
  message_view: {
    width: 360,
    height: 60,
    color: 'red'
  },
});