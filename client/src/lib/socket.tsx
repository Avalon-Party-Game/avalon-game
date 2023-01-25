import React, { useContext } from "react";
import { autorun, toJS } from "mobx";
import { history } from "../router";
import { io } from "socket.io-client";
import { message } from "antd";
import { roomStore } from "../store/room";
import { taskStore } from "../store/task";
import { userStore } from "../store/user";
import type { Socket } from "socket.io-client";
import type { RoomDTO } from "../../../server/src/room";
import type { Stage } from "../../../server/src/state/stage";
import type { PlayerDTO } from "../../../server/src/room/player";
import type { TaskDTO } from "../../../server/src/task";

const isHttps = window.location.protocol === "https:";

const ws = isHttps
    ? `wss://${window.location.host}`
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
            roomStore.updatePlayerInfo(player);
        });

        this.socket.on("taskChange", (taskPoll: TaskDTO) => {
            console.log("taskChange", taskPoll);
            taskStore.updateTaskPoll(taskPoll);
        });

        this.socket.on("kick", () => {
            message.error("连接被中断");
            this.socket.disconnect();
            userStore.updateUserInfo(null);
            history.push("/");
        });

        autorun(() => {
            if (userStore.userInfo?.name && this.socket.disconnected) {
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
