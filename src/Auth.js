import { AsyncStorage } from 'react-native';

export const USER_KEY = "auth-link-key";

export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((reslove, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
            reslove(true);
        }
        else {
            reslove(false);
        }
      })
      .catch(err => reject(err));
  });
}