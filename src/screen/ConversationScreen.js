/**
 * Chat Session List
 */

import React, { Component } from "react";

import WS from '../socket/ws';

import { StyleSheet, FlatList, View, Text, TextInput, TouchableHighlight, Image } from 'react-native';

import { NavigationEvents } from "react-navigation";

export default class ConversationScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = props;
        this.state = {
            sender_uid: navigation.getParam("user_id", ""),
            sender_name: navigation.getParam("user_name", ""),
            sender_head_portrait: navigation.getParam("head_portraits", ""),
            conversation_list: [],
        };

        this.socket = WS.getSocket();
    }

    init = () => {
        const { navigation } = this.props;
        this.setState({sender_uid: navigation.getParam("user_id", "")});
        this.setState({sender_name: navigation.getParam("user_name", "")});
        this.setState({sender_head_portrait: navigation.getParam("head_portraits", "")});
    }

    willFocus = (payload) => {
        
        this.init();

        console.log("Conversation Screen participant_uid: " + this.state.sender_uid);
        this.getConversationList();
    }

    getConversationList = () => {
        this.socket.emit("get_conversation_list", 
            this.state.sender_uid, 
            (result) => {this.resConversationList(result)});
    }

    resConversationList = (result) => {
        if (result) {
            this.setState({conversation_list: result});
            console.log(this.state.conversation_list);
        }

    }

    moveToChatScreen = async (item) => {
        if (item == null) {
            return;
        }
            
        this.props.navigation.navigate("Chat", {
            sender_uid: this.state.sender_uid,
            sender_name: this.state.sender_name,
            sender_head_portrait: this.state.sender_head_portrait,
            host_uid: item.host_uid,
            participant_uid: item.participant_uid,
            conversation_id: item.conversation_id,
        });
    }

    flatItem = (item, index) => {
        console.log("Flat item index: " + index);
        return (
            <TouchableHighlight
                onPress={ () => {this.moveToChatScreen(item)} }
            >
                <View style={ styles.flat_item }>
                    <Image style={ styles.flat_reviewer_head_portrait } 
                        source={ { uri: WS.BASE_URL + item.host_head_portrait} }
                    />
                    <Image style={ styles.flat_reviewer_head_portrait }
                        source={ { uri: WS.BASE_URL + item.participant_head_portait} }
                    />
                    <Text style={ styles.flat_content }>Tap to chat</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={(payload) => {this.willFocus(payload)}}
                />
                <FlatList
                    data={this.state.conversation_list}
                    renderItem={({item, index}) => (
                        this.flatItem(item, index))}
                    keyExtractor={item => item.conversation_id}
                />
            </View>
        );
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

    flat_content: {
        paddingLeft: 10,
        fontSize: 18,
        marginTop: 4,
        paddingTop: 8,
        textAlign: 'center',
    },
    
    flat_reviewer_head_portrait: {
        width: 72,
        height: 72,
        
        borderWidth: 1,
        borderRadius: 100,
    },




});

