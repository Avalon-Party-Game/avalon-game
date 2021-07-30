import React, { useContext } from "react";
import { autorun, toJS } from "mobx";
import { io } from "socket.io-client";
import { roomStore } from "../store/room";
import { userStore } from "../store/user";
import type { Socket } from "socket.io-client";
import type { RoomDTO } from "../../../server/src/room";
import type { Stage } from "../../../server/src/statemachine/stage";

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

    constructor(public socket: Socket) {
        this.socket.on("roomChange", (room: RoomDTO) => {
            console.log("roomChange", room);
            roomStore.updateRoom(room);
        });

        this.socket.on("stageChange", (stage: Stage) => {
            console.log("stageChange", stage);
            roomStore.updateStage(stage);
        });

        autorun(() => {
            if (userStore.userInfo && this.socket.disconnected) {
                console.log("connecting: ", toJS(userStore.userInfo));
                const name = userStore.userInfo.name;
                this.socket.io.opts.query = { name };
                this.socket.connect();
            }
        }, {});
    }
}

export const SocketClientContext = React.createContext<SocketClient>(
    SocketClient.instance
);

export const useSocketClient = () => {
    return useContext(SocketClientContext);
};
