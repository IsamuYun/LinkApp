import React, { Component } from "react";
import { Platform } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';

import SlackMessage from "../message/SlackMessage";

import WS from '../socket/ws';

import { withNavigationFocus } from 'react-navigation';

export class ChatScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      messages: [],
      conversation_id: navigation.getParam("conversation_id", ""),
      host_uid: navigation.getParam("host_uid", ""),
      participant_uid: navigation.getParam("participant_uid", ""),
      sender_uid: navigation.getParam("sender_uid", ""),
      sender_name: navigation.getParam("sender_name", ""),
      sender_head_portrait: navigation.getParam("sender_head_portrait", ""),
      sender: {
        _id: navigation.getParam("sender_uid", ""),
        name: navigation.getParam("sender_name", "Kakashi"),
        avatar: WS.BASE_URL + navigation.getParam("sender_head_portrait", "kakashi.png"),
      },
      update_time: 0,
    };
    this.socket = WS.getSocket();
    //
  }

  getConversationId = () => {
    this.socket.emit("get_conversation_id", 
      this.state.host_uid, 
      this.state.participant_uid, 
      (result) => {this.resConversationId(result)});
  }

  // Get Conversation Id, cause sometime conversation id is empty.
  resConversationId = (result) => {
    if (result) {
      this.setState({conversation_id: result});
    }
  }

  messageList = async (result) => {
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
      msg.text = message.content;
      msg.user._id = message.sender_uid;
      msg.user.name = message.sender_name;
      msg.user.avatar = WS.BASE_URL + message.sender_head_portrait;
      msg_list.push(msg);
    });
    msg_list_reverse = msg_list.reverse();
    this.setState({messages: msg_list_reverse});
  }

  getMessages = async () => {
    console.log("Getting Message");
    this.socket.emit("get_message", this.state.conversation_id, (result) => {this.messageList(result)});
  }

  getUserId = async () => {
    
  }

  setInit = () => {
    console.log("conversation id is " + this.state.conversation_id);
    console.log("sender uid is " + this.state.sender_uid);
    console.log("sender name is " + this.state.sender_name);
    console.log("sender head portrait is " + this.state.sender_head_portrait);
    console.log("host uid is " + this.state.host_uid);
    console.log("participant uid is " + this.state.participant_uid);
    //this.setState({conversation_id: navigation.getParam("conversation_id", "")});
    //this.setState({sender_uid: navigation.getParam("sender_uid", "")});
    //this.setState({sender_name: navigation.getParam("sender_name", "")});
    //this.setState({sender_head_portrait: navigation.getParam("sender_head_portrait", "")});
    //this.setState({host_uid: navigation.getParam("host_uid", "")});
    //this.setState({participant_uid: navigation.getParam("participant_uid", "")});
    /*
    sender = {
      _id: this.state.sender_uid,
      name: this.state.sender_name,
      avatar: WS.BASE_URL + this.state.sender_head_portrait,
    };
    */
    // this.setState({sender: sender});

    if (this.state.conversation_id == "") {
      this.getConversationId();
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      console.log("Chat Screen is focused.");
      this.setInit();
      this.getMessages();
      
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  
  async onSend(messages = []) {
    this.setInit();
    this.socket.emit("send_message", this.state.conversation_id, 
          this.state.host_uid, 
          this.state.sender_uid, 
          messages[0].text,
          );

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))

    // this.getMessages();
    
    
  }

  renewConversationId = () => {
    
  }

  shouldComponentUpdate() {
    let milliseconds = new Date().getTime();
    if (milliseconds - this.state.update_time >= 6000) {
      console.log("Update Message");
      this.state.update_time = milliseconds;
      this.getMessages();
      return true;
    }
    return false;
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props;

    let messageTextStyle;

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
        messages={ this.state.messages }
        onSend={ messages => this.onSend(messages) }
        user={ this.state.sender }
        renderMessage={ this.renderMessage }
        >
      </GiftedChat>
    )
  }
}

// withNavigationFocus returns a component that wraps TabScreen and passes
// in the navigation prop
export default withNavigationFocus(ChatScreen);