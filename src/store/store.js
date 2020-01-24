import AsyncStorage from '@react-native-community/async-storage';
import { EmitFlags } from 'typescript';

export default class Store {
    static storeUserId = async (user_id) => {
        try {
            await AsyncStorage.setItem("user_id", user_id);
        }
        catch (e) {
            console.log("Store user id error: " + e.message);
        }
    }

    static storeUserName = async (user_name) => {
        try {
            await AsyncStorage.setItem("user_name", user_name);
        }
        catch (e) {
            console.log("Store user name error: " + e.message);
        }
    }

    static storeHeadPortraits = async (file_name) => {
        try {
            await AsyncStorage.setItem("head_portraits", file_name);
        }
        catch (e) {
            console.log("Store head portraits error: " + e.message);
        }
    }

    static storeOtherUserId = async (user_id) => {
        try {
            await AsyncStorage.setItem("other_uid", user_id);
        }
        catch (e) {
            console.log("Store other user id error: " + e.message);
        }
    }

    static storeOtherHeadPortraits = async (file_name) => {
        try {
            await AsyncStorage.setItem("other_head_portraits", file_name);
        }
        catch (e) {
            console.log("Store other user's head portraits error: " + e.message);
        }
    }

    static async getUserInfo(user_info)
    {
        user_info.user_id = await AsyncStorage.getItem("user_id");
        user_info.user_name = await AsyncStorage.getItem("user_name");
        user_info.head_portraits = await AsyncStorage.getItem("head_portraits");
        console.log(user_info);
    }
} 