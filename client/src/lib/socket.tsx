import React, { useContext } from "react";
import { io, Socket } from "socket.io-client";

export class SocketClient {
    private static _instance: SocketClient;
    public static get instance() {
        if (!this._instance) {
            this._instance = new SocketClient(
                io("ws://localhost:3100", {
                    autoConnect: false,
                    transports: ["websocket"],
                })
            );
        }
        return this._instance;
    }
    constructor(public socket: Socket) {}
}

export const SocketClientContext = React.createContext<SocketClient>(
    SocketClient.instance
);

export const useSocketClient = () => {
    return useContext(SocketClientContext);
};
