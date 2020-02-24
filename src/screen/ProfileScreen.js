import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image, FlatList, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import ImagePicker from 'react-native-image-picker';
import WS from '../socket/ws';

import AsyncStorage from '@react-native-community/async-storage';
import Store from "../store/store";

import { NavigationEvents } from "react-navigation";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      photo: null,
      message: "",
      user_id: navigation.getParam("user_id", ""),
      user_name: navigation.getParam("user_name", ""),
      head_portraits: navigation.getParam("head_portraits", ""),
      server_file_name: "",
      user: {
        money: 0,
        class_name: "",
        school: "",
        skill: "",
        lesson: "",
        teach: {
          Arts: 0,
          Computer: 0,
          Language: 0,
          Literature: 0,
          Mathematics: 0
        },
        learn: {
          Arts: 0,
          Computer: 0,
          Language: 0,
          Literature: 0,
          Mathematics: 0
        },
      },
      class_name: "",
      school: "",
      skill: 0,
      lesson: "",
      review_list: [],  // User's review list.
    }

    this.socket = WS.getSocket();
    this.base64 = "";
  }

  componentDidMount() {
    console.log("componentDidMount:");
    // this.getUserFromStore();
    this.getUserInfo();
    /*
    setTimeout(() => {
      this.getUserInfo();
    }, 10000);
    */

    this.socket.on("read_chunk_response", (message) => {this.response(message)});
    this.socket.on("transfer_response", (message) => {this.transferResponse(message)});
    this.socket.on("single_user_res", (message) => {this.userResponse(message)});
    
  }

  willFocus = (payload) => {
    this.getUserInfo();
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
      console.log("Profile user info:");
      // console.log(this.state.user);
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
  
  // Get user info from AsyncStorage
  getUserFromStore = async () => {
    let user_id = "";
    let user_name = "";
    let head_portraits = "";
    try {
      user_id = await AsyncStorage.getItem("user_id");
      user_name = await AsyncStorage.getItem("user_name");
      head_portraits = await AsyncStorage.getItem("head_portraits");
    }
    catch (e) {
      console.log(e.message);
    }
    this.setState({user_id});
    this.setState({user_name});
    this.setState({head_portraits});

  }
  
  getMoney = async () => {
    this.socket.emit("get_money", this.state.user_id, function(money) {
      this.setState({money});
    }.bind(this));
  }

  getUserInfo = () => {
    // console.log("Profile user_id: " + this.state.user_id);
    // console.log("Profile user_name: " + this.state.user_name);
    // console.log("Profile head portrait: " + this.state.head_portraits);
    this.socket.emit("get_single_user", this.state.user_id);

    this.getReviewList();
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
    this.socket.emit("write_chunk", filename, offset, data, this.state.user_id, function(result) {
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

  onUpdateProfile = () => {
    // console.log("Class name: " + this.state.class_name);
    // console.log("School: " + this.state.school);
    // console.log("Skills: " + this.state.skill);
    // console.log("Lessons: " + this.state.lesson);

    const {user} = this.state;

    user.class_name = this.state.class_name;
    user.school = this.state.school;
    
    this.socket.emit("update_profile", JSON.stringify(user), (result) => {
      if (result) {
        console.log("Update info successful");
      }
      else {
        console.log("Update info failed.");
      }
    });
  }

  updateState = (value, key1, key2) => {
    const { user } = this.state;
    if (value) {
      user[key1][key2] = 1;
    }
    else {
      user[key1][key2] = 0;
    }
    this.setState({user});

    this.onUpdateProfile();
  }

  updateClassName = (value) => {
    this.setState({class_name: value});
    this.onUpdateProfile();
  }

  updateSchool = (value) => {
    this.setState({school: value});
    this.onUpdateProfile();
  }
  // Get review list
  getReviewList = async () => {
    this.socket.emit("get_review_list", this.state.user_id, (result) => {this.reviewList(result)});
  }

  reviewList = async (result) => {
    review_list = [];
    result.map((review, index) => {
      console.log(review);
      review.id = index;
      review_list.push(review);
    });
    this.setState({review_list: review_list});
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
        <NavigationEvents
          onWillFocus={(payload) => {this.willFocus(payload)}}
        />
        
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
        
        <View style={styles.status_view}>
          <Text style={ styles.normal_title }>Name:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ this.state.user_name }</Text>
        </View>
        
        <View style={styles.status_view}>
          <Text style={ styles.normal_title }>Balance:</Text>
          <Text style={ styles.dollar_number }>{ this.state.user.money }</Text>
        </View>

        <View style={ styles.status_view }>
          <Text style={ styles.normal_title }>I'm class of:</Text>
          <TextInput style={ {width: 120, height: 24, fontSize: 18} }
              placeholder="Class"
              onChangeText={(text) => this.updateClassName(text)}
              value={ this.state.class_name }
          />
        </View>
        
        <View style={ styles.status_view }>
          <Text style={ styles.normal_title }>My school is:</Text>
          <TextInput style={ {width: 120, height: 24, fontSize: 18} }
              placeholder="School"
              onChangeText={(text) => this.updateSchool(text)}
              value={ this.state.school }
          />
        </View>
        <View style={ styles.skill_panel}>
          <View style={ styles.skill_view }>
            <Text style={ styles.skill_title }>I can teach</Text>
            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Arts & Crafts</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "teach", "Arts")} }
                value={ this.state.user.teach.Arts ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Computers</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "teach", "Computer")} }
                value={ this.state.user.teach.Computer ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Language</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "teach", "Language")} }
                value={ this.state.user.teach.Language ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Literature</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "teach", "Literature")} }
                value={ this.state.user.teach.Literature ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Mathematics</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "teach", "Mathematics")} }
                value={ this.state.user.teach.Mathematics ? true : false }
                style={ styles.switch_item }
              />
            </View>
          </View>

          <View style={ styles.skill_view }>
            <Text style={ styles.skill_title }>I want to learn</Text>
            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Arts & Crafts</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "learn", "Arts")} }
                value={ this.state.user.learn.Arts ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Computers</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "learn", "Computer")} }
                value={ this.state.user.learn.Computer ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Language</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "learn", "Language")} }
                value={ this.state.user.learn.Language ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Literature</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "learn", "Literature")} }
                value={ this.state.user.learn.Literature ? true : false }
                style={ styles.switch_item }
              />
            </View>

            <View style={ styles.status_view }>
              <Text style={ styles.switch_title }>Mathematics</Text>
              <Switch
                onValueChange={ (value) => {this.updateState(value, "learn", "Mathematics")} }
                value={ this.state.user.learn.Mathematics ? true : false }
                style={ styles.switch_item }
              />
            </View>
          </View>
        </View>

        <View style={ styles.status_view }>
          <Text style={ styles.normal_title }>Review List:</Text>
        </View>

        <View style={ styles.review_view }>
          <FlatList
            data={this.state.review_list}
            renderItem={({item}) => (
              <View style={styles.flat_item}>
                <Image style={ styles.flat_reviewer_head_portrait } 
                  source={ { uri: WS.BASE_URL + item.reviewer_head_portraits} }
                />
                <Text style={styles.flat_title}>{item.content}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
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

  normal_text: {
    width: 180,
    fontSize: 18,
  },

  normal_title: {
    width: 180,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 4,
  },

  switch_title: {
    width: 112,
    fontSize: 18,
    // alignSelf: "flex-start",
  },

  switch_item: {
    width: 56,
    // alignSelf: "flex-end",
  },

  balance_view: {
    width: 240,
    height: 40,
    marginTop: 8,
    //textAlign: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },

  skill_title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  skill_panel: {
    width: 360,
    flexDirection: 'row',
  },

  skill_view: {
    width: 180,
    borderWidth: 1,
    marginTop: 2,
    marginRight: 4,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 4,
    borderRadius: 5,
  },

  status_view: {
    width: 360,
    height: 32,
    // justifyContent: 'flex-start',
    flexDirection: 'row',
    // marginBottom: 2,
    // textAlign: 'center',
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

  flat_item: {
    backgroundColor: '#99CCff',
    paddingLeft: 4,
    marginVertical: 2,
    marginHorizontal: 8,
    flexDirection: "row",
  },

  flat_title: {
    paddingLeft: 10,
    fontSize: 18,
    marginTop: 4,
    paddingTop: 8,
  },

  flat_reviewer_head_portrait: {
    width: 48,
    height: 48,
    
    borderWidth: 1,
    borderRadius: 100,
  },

  review_view: {
    width: 360,
  },

});