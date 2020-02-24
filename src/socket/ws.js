import io from 'socket.io-client';

console.ignoredYellowBox = ["Remote debugger"]
import { YellowBox } from "react-native"
YellowBox.ignoreWarnings([
    "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

// const SERVER_URL = 'ws://192.168.0.174:5000';
const SERVER_URL = 'ws://157.245.124.194:5000';
// const SERVER_URL = 'ws://172.31.99.189:5000';
// const SERVER_URL = 'ws://172.31.99.210:5000';

export default class WS {
    // static BASE_URL = "http://192.168.0.174:5000/";
    static BASE_URL = "http://157.245.124.194:5000/";
    // static BASE_URL = "http://172.31.99.189:5000/";
    //static BASE_URL = "http://172.31.99.210:5000/";

    static init() {
        this.ws = io(SERVER_URL, { 
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity, 
            transports: ['websocket'], 
            jsonp: false,
        });
    }

    static getSocket() {
        return this.ws;
    }

    static connected = false;

}