import { makeAutoObservable, toJS } from "mobx";
import type { Socket } from "socket.io";
import type { Character, ISerializable } from "../charater/base";
import type { GameContext } from "../state";

export interface PlayerDTO {
    name: string;
    role?: Character;
    roleName?: string;
    connected?: boolean;
}

export class Player implements ISerializable {
    connected = true;

    constructor(
        public context: GameContext,
        public name: string,
        public socket: Socket,
        public role?: Character
    ) {
        makeAutoObservable(this, { socket: false, toJSON: false });
        this.notify();
        this.handleConnect();
    }

    updateConnected = (connected: boolean) => {
        this.connected = connected;
    };

    handleConnect = () => {
        this.connected = true;
        this.socket.on("disconnect", () => this.updateConnected(false));
    };

    replace = (name: string, socket: Socket) => {
        this.socket.offAny();
        this.name = name;
        this.socket = socket;
        this.handleConnect();
        this.notify();
    };

    notify = () => {
        this.socket.emit("playerChange", this.toJSON());
        this.socket.emit("roomChange", this.context.room.toJSON());
        this.socket.emit("stageChange", this.context.state.stage);
        this.socket.emit("taskChange", this.context.taskPoll.toJSON());
    };

    toJSON: () => PlayerDTO = () => {
        return {
            name: toJS(this.name),
            role: toJS(this.role),
            connected: this.socket.connected,
        };
    };
}
