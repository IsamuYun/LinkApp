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
    

} 