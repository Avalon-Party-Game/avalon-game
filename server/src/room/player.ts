import type { Socket } from "socket.io";
import type { Character } from "../charater/base";
import type { GameContext } from "../state";

export interface PlayerDTO {
    name: string;
    role?: Character;
    roleName?: string;
    connected?: boolean;
}

export class Player {
    connected = true;

    constructor(
        public context: GameContext,
        public name: string,
        public socket: Socket,
        public role?: Character
    ) {
        this.notify();
        this.handleConnect();
    }

    updateConnected = (connected: boolean) => {
        this.connected = connected;
    };

    handleConnect = () => {
        this.connected = true;
        this.socket.on("disconnect", async () => {
            this.updateConnected(false);
            this.socket.offAny();
            await this.socket.leave("avalon");
            this.context.room.notify();
        });
    };

    replace = (name: string, socket: Socket) => {
        this.socket.offAny();
        this.name = name;
        this.socket = socket;
        this.handleConnect();
        this.notify();
        this.context.room.notify();
    };

    notify = () => {
        this.socket.emit("playerChange", this.toJSON());
        this.socket.emit("roomChange", this.context.room.toJSON());
        this.socket.emit("stageChange", this.context.state.stage);
        this.socket.emit("taskChange", this.context.taskPoll.toJSON());
    };

    toJSON: () => PlayerDTO = () => {
        return {
            name: this.name,
            role: this.role,
            connected: this.connected,
        };
    };

    toSensitiveJSON: () => PlayerDTO = () => {
        return {
            name: this.name,
            connected: this.connected,
        };
    };
}
