import React, { Component } from "react";
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';

import SlackMessage from "../message/SlackMessage";

import WS from '../socket/ws';

const user = {
  _id: 2,
  name: "Minato",
  avatar: WS.BASE_URL + "minato.png",
}

const otherUser = {
  _id: 1,
  name: "Kakashi",
  avatar: WS.BASE_URL + "kakashi.png",
}

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello, teacher.',
          createdAt: new Date(),
          user: user,
        },
        {
          _id: 2,
          text: 'Hi, master',
          createdAt: new Date(),
          user: otherUser,
        },
        {
          _id: 3,
          text: 'Hi, Kakashi.',
          createdAt: new Date(),
          user: user,
        },
        {
          _id: 4,
          text: 'Hi, Minato.',
          createdAt: new Date(),
          user: otherUser,
        },

      ],
    })
  }
  
  onSend(messages = []) {
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
        user={otherUser}
        renderMessage={this.renderMessage}
      />
    )
  }
}