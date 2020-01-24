import React, { Component } from "react";
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';

import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';

import SlackMessage from "../message/SlackMessage";

import WS from '../socket/ws';
import Store from '../store/store';

import AsyncStorage from "@react-native-community/async-storage";

import { NavigationEvents } from "react-navigation";

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      messages: [],
      host_uid: navigation.getParam("user_id", ""),
      host_name: navigation.getParam("user_name", ""),
      host_head_portraits: navigation.getParam("head_portraits", ""),
      user_id: navigation.getParam("user_id", ""),
      user_name: navigation.getParam("user_name", ""),
      head_portraits: navigation.getParam("head_portraits", ""),
      user_info: {},
      sender: {
        _id: '',
        name: 'Kakashi',
        avatar: WS.BASE_URL + "kakashi.png",
      }
    };
    this.state.sender._id = this.state.user_id;
    this.state.sender.name = this.state.user_name;
    this.state.sender.avatar = WS.BASE_URL + this.state.head_portraits;
    this.socket = WS.getSocket();
    this.socket.on("single_user_res", (message) => {this.userResponse(message)});
  }

  messageList = (result) => {
    msg_list = [];
    result.map((message, index) => {
      let msg = {
        _id: 0,
        text: '',
        createdAt: new Date(),
        user: {
          _id: '',
          name: '',
          avatar: '',
        }
      };
      msg._id = index;
      msg.text = message.message;
      msg.user._id = message.user_id;
      if (msg.user._id == this.state.host_uid) {
        msg.user.name = this.state.host_name;
        msg.user.avatar = WS.BASE_URL + this.state.host_head_portraits;
      }
      else if (msg.user.id == this.state.user_id) {
        msg.user.name = this.state.user_name;
        msg.user.avatar = WS.BASE_URL + this.state.head_portraits;
      }
      else {
        this.socket.emit("get_single_user", message.user_id);
      }
      
      msg_list.push(msg);
    });
    this.setState({messages: msg_list});
    console.log(this.state.messages);
  }

  willFocus = (payload) => {

  }

  getMessages = async () => {
    if (this.state.host_uid === '') {
      this.setState({host_uid: this.state.user_id});
      this.setState({host_name: this.state.user_name});
      this.setState({host_head_portraits: this.state.head_portraits});
    }
    this.socket.emit("get_message", this.state.host_uid, (result) => {this.messageList(result)});
  }

  getUserId = async () => {
    try {
      if (this.state.host_uid === '') {
        this.setState({host_uid: this.state.user_id});
        this.setState({host_name: this.state.user_name});
        this.setState({host_head_portraits: this.state.head_portraits});
      }
      this.socket.emit("get_message", this.state.host_uid, (result) => {this.messageList(result)});
    }
    catch (e) {
      console.log(e.message);
    }
  }

  userResponse = (message) => {
    if (message.code == 0) {
      user_info = message.data;
      let sender = {
        _id: user_info.user_id,
        name: user_info.user_name,
        avatar: WS.BASE_URL + user_info.head_portraits
      }
      const list = this.state.messages;
      
      for (let i = 0; i < list.length; i++) {
        

        if (list[i].user._id == sender._id) {
          list[i].user._id = sender._id;
          list[i].user.name = sender.name;
          list[i].user.avatar = sender.avatar;
        }
      }
      
      this.setState({messages:list});
    }
  }

  setHost = () => {
    const {navigation} = this.props;
    this.setState({host_uid: navigation.getParam("host_uid", "")});
    this.setState({host_name: navigation.getParam("host_name", "")});
    this.setState({host_head_portraits: navigation.getParam("host_head_portraits", "")});
    this.setState({user_id: navigation.getParam("user_id", "")});
    this.setState({user_name: navigation.getParam("user_name", "")});
    this.setState({head_portraits: navigation.getParam("head_portraits", "")});
  }

  componentDidMount() {
    this.setHost();
    this.getUserId();

    setTimeout(() => {
      this.setHost();
      this.getUserId();
    }, 3000);
  }
  
  onSend(messages = []) {
    //console.log("Host uid: " + this.state.host_uid);
    if (this.state.host_uid === '') {
      this.setState({host_uid: this.state.user_id});
      this.setState({host_name: this.state.user_name});
      this.setState({host_head_portraits: this.state.head_portraits});
    }
    //console.log("Chat other uid:" + this.state.other_uid);
    //console.log("Chat user id: " + this.state.user_id);
    //console.log(messages);
    //console.log("Message: " + messages[0].text);
    this.socket.emit("send_message", this.state.host_uid, this.state.user_id, messages[0].text);


    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    
    
    
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={this.state.sender}
        renderMessage={this.renderMessage}
        >
      </GiftedChat>
    )
  }
}