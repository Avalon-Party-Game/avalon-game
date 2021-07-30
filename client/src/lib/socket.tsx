import React, { useContext } from "react";
import { autorun, toJS } from "mobx";
import { io } from "socket.io-client";
import { roomStore } from "../store/room";
import { userStore } from "../store/user";
import type { Socket } from "socket.io-client";
import type { RoomDTO } from "../../../server/src/room";
import type { Stage } from "../../../server/src/statemachine/stage";
import type { PlayerDTO } from "../../../server/src/room/player";
import type { TaskDTO } from "../../../server/src/task";
import { taskStore } from "../store/task";

const ws = import.meta.env.DEV
    ? "ws://localhost:3100"
    : `ws://${window.location.host}`;

export class SocketClient {
    private static _instance: SocketClient;

    public static get instance() {
        if (!this._instance) {
            this._instance = new SocketClient(
                io(ws, {
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

        this.socket.on("playerChange", (player: PlayerDTO) => {
            console.log("playerChange", player);
            userStore.updatePlayerInfo(player);
        });

        this.socket.on("taskChange", (taskPoll: TaskDTO) => {
            console.log("taskChange", taskPoll);
            taskStore.updateTaskPoll(taskPoll);
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
