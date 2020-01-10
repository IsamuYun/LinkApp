import io from 'socket.io-client';

const SERVER_URL = 'http://127.0.0.1:5000';

export default class WS {
    static init() {
        this.ws = io(SERVER_URL, { reconnection: false, transports: ['websocket'], jsonp: false });
    }

    static getSocket() {
        return this.ws;
    }

}