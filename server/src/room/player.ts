import { observable } from "mobx";
import type { Socket } from "socket.io";
import type { Character } from "../charater/base";
import type { GameContext } from "../state";
import { Stage } from "../state/stage";
import type { Vote } from "../task";

export interface PlayerDTO {
    name: string;
    role?: Character;
    roleName?: string;
    connected?: boolean;
}

export class Player {
    private _connected = observable.box(false);

    get connected() {
        return this._connected.get();
    }

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
        this._connected.set(connected);
    };

    handleAction = () => {
        const context = this.context;
        this.socket.on("startWaiting", () =>
            context.state.updateStage(Stage.WAITING)
        );
        this.socket.on("startGame", () =>
            context.state.updateStage(Stage.STARTED)
        );
        this.socket.on("startNewElection", context.taskPoll.startNewElection);
        this.socket.on("kickPlayer", context.room.kickPlayer);
        this.socket.on("kickOffline", context.room.kickOffline);
        this.socket.on("voteForPlayers", (vote: Vote) => {
            context.taskPoll.voteForPlayersFrom(this.name, vote);
        });
        this.socket.on("voteForTask", (vote: Vote) => {
            context.taskPoll.voteForTaskFrom(this.name, vote);
        });
        this.socket.on("reset", context.room.reset);
    };

    handleConnect = () => {
        this.updateConnected(true);
        this.socket.on("disconnect", async () => {
            await this.socket.leave("avalon");
            this.socket.offAny();
            this.updateConnected(false);
        });
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
