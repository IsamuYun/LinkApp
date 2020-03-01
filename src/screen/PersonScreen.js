import React, { Component } from "react";
import { StyleSheet, FlatList, View, Text, TextInput, TouchableHighlight, Image } from 'react-native';

import WS from '../socket/ws';
import { counter } from "@fortawesome/fontawesome-svg-core";

import { NavigationEvents } from "react-navigation";
import { _ } from "core-js";

function Item({ item_data }) {
  return (
    <View style={styles.flat_item}>
      <Text style={styles.flat_title}>{item_data.content}</Text>
      <Image style={ styles.flat_reviewer_head_portrait } 
        source={ { uri: WS.BASE_URL + item_data.reviewer_head_portraits} }
      />
    </View>
  );
}

export default class PersonScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;

    this.state = {
      user_name: navigation.getParam("user_name", ""),
      user_id: navigation.getParam("user_id", ""),
      head_portraits: navigation.getParam("head_portraits", ""),
      other_uid: navigation.getParam("other_uid", ""),
      other_user_name: navigation.getParam("other_user_name", ""),
      other_head_portraits: navigation.getParam("other_head_portraits", "Yasuo.jpg"),
      other_user_info: {
        money: 0,
        school: '',
        class_name: '',
        teach: {},
        learn: {},
      },
      teach_str: "",
      learn_str: "",
      review_content: "",
      review_list: [],
    };
    
    this.socket = WS.getSocket();
    this.socket.on("single_user_res", (message) => {this.otherUserInfo(message)});
    this.socket.on("review_list_res", (payLoad) => {this.reviewList(payLoad)});
    this.socket.on("increase_money_res", (updatedMoney) => {this.updatedMoneyRes(updatedMoney)})
  }

  willFocus = (payload) => {
    const {navigation} = this.props;
    
    this.state.user_name = navigation.getParam("user_name", "");
    this.state.user_id = navigation.getParam("user_id", "");
    this.state.head_portraits = navigation.getParam("head_portraits", "");
    this.state.other_uid = navigation.getParam("other_uid", "");
    this.state.other_user_name = navigation.getParam("other_user_name", "");
    this.state.other_head_portraits = navigation.getParam("other_head_portraits", "Yasuo.jpg");
    this.getUser();
    this.getReviewList();
  }

  updateOtherUid = () => {
    const { navigation } = this.props;
    this.setState({other_uid: navigation.getParam("other_uid", "")});
  }

  getUser = async () => {
    this.socket.emit("get_single_user", this.state.other_uid); 
  }

  otherUserInfo = (message) => {
    console.log("Get other user info: ", message);
    if (message.code == 0) {
      this.setState({other_user_info: message.data});
      let teach_str = ""
      const teach_list = message.data.teach;
      if (teach_list.Arts != 0) {
        teach_str += "Arts & Crafts, "
      }
      if (teach_list.Computer != 0) {
        teach_str += "Computers, "
      }
      if (teach_list.Language != 0) {
        teach_str += "Language, "
      }
      if (teach_list.Literature != 0) {
        teach_str += "Literature, "
      }
      if (teach_list.Mathematics != 0) {
        teach_str += "Mathematics"
      }
      let learn_str = ""
      const learn_list = message.data.learn;
      if (learn_list.Arts != 0) {
        learn_str += "Arts & Crafts, "
      }
      if (learn_list.Computer != 0) {
        learn_str += "Computers, "
      }
      if (learn_list.Language != 0) {
        learn_str += "Language, "
      }
      if (learn_list.Literature != 0) {
        learn_str += "Literature, "
      }
      if (learn_list.Mathematics != 0) {
        learn_str += "Mathematics"
      }
      this.setState({learn_str});
      this.setState({teach_str});
    }
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.getUser();
    }, 1000);

    this.getReviewList();
  }

  moveToChatScreen = () => {
    console.log("Host uid:" + this.state.other_uid);
    console.log("Participant uid:" + this.state.user_id);
    this.props.navigation.navigate("Chat", {
      host_uid: this.state.other_uid,
      participant_uid: this.state.user_id,
      sender_uid: this.state.user_id,
      sender_name: this.state.user_name,
      sender_head_portrait: this.state.head_portraits,
      conversation_id: "",
    });
  }

  // Send Reviewer
  sendReview = async () => {
    this.socket.emit("send_review", this.state.other_uid, this.state.user_id, this.state.review_content, function(result) {
      if (result) {
        console.log("Send review successful.");
      }
      else {
        console.log("Send review failed.");
      }
    });
    this.getReviewList();
  }

  getReviewList = async () => {
    this.socket.emit("get_review_list", this.state.other_uid);
  }

  reviewList = async (result) => {
    review_list = [];
    if (result.data == null) {
      console.log("Bug");
    }
    result.data.map((review, index) => {
      console.log(review);
      review.id = index;
      review_list.push(review);
    });
    this.setState({review_list: review_list});
  }

  onPay = async () => {
    this.socket.emit("increase_money", this.state.user_id, this.state.other_uid, -5);
  }

  updatedMoneyRes = (money) => {
    if (money > 0) {
      this.setState({other_user_info: {money}});
    }
  }

  render() {
    const {navigation} = this.props;
    if (navigation.getParam("other_uid", "") == "") {
      return (
        <View style={ styles.container }>
          <Text>You must choose a teacher/student first.</Text>
        </View>
      );
    }
    else {
      return (
        <View style={ styles.container }>
          <NavigationEvents
            onWillFocus={(payload) => {this.willFocus(payload)}}
          />
        
          <View style={ styles.header_view }>
            <Image style={ styles.head_portrial } 
              source={ { uri: WS.BASE_URL + this.state.other_head_portraits } }
            />
          </View>

          <View style={ styles.name_view }>
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
          <Text style={ styles.normal_text }>Money: {this.state.other_user_info.money}</Text>
          <Text style={ styles.normal_text }>My school is {this.state.other_user_info.school}</Text>
          <Text style={ styles.normal_text }>I can teach {this.state.teach_str}</Text>
          <Text style={ styles.normal_text }>I want to learn {this.state.learn_str}</Text>
        </View>

        <View style={ styles.send_review_view }>
          <TextInput style={ styles.review_content }
              placeholder="Leave a review:"
              onChangeText={(review_content) => { this.setState({review_content}) }}
              value={ this.state.review_content }
          />
          <TouchableHighlight
            style={ styles.send_review_submit }
            onPress={ () => this.sendReview() }
          >
            <Text style={ styles.send_review_submit_text }>Send Review</Text> 
          </TouchableHighlight>
        </View>

        <View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  flat_item: {
    backgroundColor: '#99CCff',
    paddingLeft: 10,
    marginVertical: 4,
    marginHorizontal: 16,
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

  header_view: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },

  name_view: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  head_portrial: {
    width: 128,
    height: 128,
    
    borderWidth: 1,
    borderRadius: 100,
  },

  button_view: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },

  send_review_view: {
    flexDirection: "column",
    paddingLeft: 8,
    width: 360,

  },
  /*
  review_view: {
    flexDirection: "row",
    width: 300,
    height: 24,
    paddingLeft: 4,
    // alignContent: "flex-start",
  },
  */
  review_content: {
    
    width: 360,
    fontSize: 18,
    //alignSelf: "flex-start",
    height: 32,
    paddingLeft: 12,
  },

  send_review_submit: {
    marginRight:10,
    marginLeft:10,
    paddingTop:2,
    backgroundColor:'#68a0cf',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    width: 160,
    height: 32,
  },

  send_review_submit_text: {
    color:'white',
    textAlign:'center',
    fontSize: 24,
  },

  submit: {
    marginRight:10,
    marginLeft:10,
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
    paddingLeft: 20,
  },

  normal_text: {
    fontSize: 20,
  },

  
});