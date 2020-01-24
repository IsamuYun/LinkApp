import io from 'socket.io-client';

const SERVER_URL = 'ws://192.168.0.174:5000';
// const SERVER_URL = 'ws://172.31.99.189:5000';

export default class WS {
    // static BASE_URL = "http://172.31.99.189:5000/";
    static BASE_URL = "http://192.168.0.174:5000/";
    static init() {
        this.ws = io(SERVER_URL, { reconnection: false, transports: ['websocket'], jsonp: false });
    }

    static getSocket() {
        return this.ws;
    }

}