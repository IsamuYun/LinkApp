import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
    };
  }
  
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi teacher',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Teacher',
            avatar: 'https://vignette.wikia.nocookie.net/naruto/images/7/71/Minato_Namikaze.png/revision/latest?cb=20160125175116',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}