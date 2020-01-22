import AsyncStorage from '@react-native-community/async-storage';

export default class Store {
    static storeUserId = async (user_id) => {
        try {
            await AsyncStorage.setItem("user_id", user_id);
        }
        catch (e) {
            console.log("Store user id error: " + e.message);
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
            console.log("other_uid:" + user_id);
        }
        catch (e) {
            console.log("Store other user id error: " + e.message);
        }
    }

    static storeOtherHeadPortraits = async (file_name) => {
        try {
            await AsyncStorage.setItem("other_head_portraits", file_name);
            console.log("other_head_portraits:" + file_name);
        }
        catch (e) {
            console.log("Store other user's head portraits error: " + e.message);
        }
    }
    

} 