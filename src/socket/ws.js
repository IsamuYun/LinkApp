import io from 'socket.io-client';

//const SERVER_URL = 'http://172.31.99.189:5000';
const SERVER_URL = 'ws://172.31.99.189:5000';

export default class WS {
    static init() {
        this.ws = io(SERVER_URL, { reconnection: false, transports: ['websocket'], jsonp: false });
    }

    static getSocket() {
        return this.ws;
    }

}