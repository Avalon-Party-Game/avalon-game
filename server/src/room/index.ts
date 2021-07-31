import { Player } from "./player";
import { RolePicker, roleTable } from "../charater/utils";
import type { ISerializable } from "../charater/base";
import type { PlayerDTO } from "./player";
import type { Socket } from "socket.io";
import type { GameContext } from "../statemachine";
import { autorun, makeAutoObservable, observable, toJS } from "mobx";
import { Stage } from "../statemachine/stage";

export interface RoomDTO {
    players: PlayerDTO[];
    count: number;
}

export class Room implements ISerializable {
    players: Player[] = [];

    get count() {
        return this.players.length;
    }

    constructor(public context: GameContext) {
        makeAutoObservable(this, {
            context: false,
            players: observable.shallow,
        });

        autorun(() => {
            this.notify();
        });

        autorun(() => {
            if (this.context.currentStage === Stage.STARTED) {
                this.startGame();
            }
        });
    }

    notify = () => {
        this.context.boradcast.emit("roomChange", this.toJSON());
    };

    kickOffline = () => {
        this.players = this.players.filter((player) => player.socket.connected);
    };

    startGame = () => {
        const rolePicker = new RolePicker(this.players.length);
        this.players.forEach((player) => {
            const role = rolePicker.pick();
            if (role) {
                const RoleConstructor = roleTable[role];
                player.role = new RoleConstructor(this);
            }
        });
        this.players.forEach((player) => {
            player.socket.emit("playerChange", player);
        });
    };

    getExistingPlayer = (name: string) => {
        return this.players.find((player) => {
            return player.name === name;
        });
    };

    joinPlayer = (name: string, socket: Socket) => {
        let player = this.getExistingPlayer(name);
        if (player) {
            console.log("replacing player: " + name);
            if (player.socket.connected) {
                player.socket.disconnect();
            }
            player.socket = socket;
            player.name = name;
            socket.emit("replace", { message: "NAME_EXIST" });
        } else {
            player = new Player(socket, name);
            this.players.push(player);
        }
        this.notify();
        return player;
    };

    kickPlayer = (name: string) => {
        const existingPlayer = this.players.find(
            (player) => player.name === name
        );
        if (existingPlayer) {
            console.log("kicking player: " + name);
            existingPlayer.socket.emit("kick");
            existingPlayer.socket.disconnect(true);
        }
        this.players = this.players.filter((player) => player.name !== name);
    };

    toJSON: () => RoomDTO = () => {
        return {
            players: toJS(this.players).map((player) => player.toJSON()),
            count: toJS(this.count),
        };
    };
}
