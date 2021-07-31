import { autorun, makeAutoObservable, toJS } from "mobx";
import { Player } from "./player";
import { RolePicker, roleTable } from "../charater/utils";
import { Stage } from "../state/stage";
import { UniqueID } from "nodejs-snowflake";
import type { ISerializable } from "../charater/base";
import type { PlayerDTO } from "./player";
import type { Socket } from "socket.io";
import type { GameContext } from "../state";

const uid = new UniqueID({ returnNumber: false, machineID: 1 });
export interface RoomDTO {
    players: PlayerDTO[];
    count: number;
    id: string | null;
}

export class Room implements ISerializable {
    players: Player[] = [];
    id: string | null = null;

    get count() {
        return this.players.length;
    }

    get onlineCount() {
        return this.players.filter((player) => player.connected).length;
    }

    constructor(public context: GameContext) {
        makeAutoObservable(this, {
            context: false,
        });

        autorun(() => {
            this.notify();
        });

        autorun(() => {
            if (this.context.state.stage === Stage.STARTED) {
                this.startGame();
            }
        });

        autorun(() => {
            if (
                this.onlineCount === 0 &&
                this.context.state.stage !== Stage.WAITING
            ) {
                console.log(
                    "All user leaved but game is ongoing, cleanning stage"
                );
                this.context.state.updateStage(Stage.WAITING);
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
        this.id = uid.getUniqueID().toString();
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
        return this.players.find((player) => player.name === name);
    };

    joinPlayer = (name: string, socket: Socket) => {
        socket.join("avalon");
        const externalPlayerJoining =
            this.context.state.stage !== Stage.WAITING &&
            !this.getExistingPlayer(name);

        if (externalPlayerJoining) {
            socket.emit("kick");
            socket.disconnect(true);
        } else {
            let player = this.getExistingPlayer(name);
            if (player) {
                console.log("replacing player: " + name);
                if (player.socket.connected) {
                    player.socket.disconnect();
                }
                player.replace(name, socket);
                socket.emit("replace", { message: "NAME_EXIST" });
                this.notify();
            } else {
                player = new Player(this.context, name, socket);
                this.players.push(player);
            }
            return player;
        }
    };

    kickPlayer = (name: string) => {
        const existingPlayer = this.getExistingPlayer(name);
        if (existingPlayer) {
            console.log("kicking player: " + name);
            existingPlayer.socket.emit("kick");
            existingPlayer.socket.disconnect(true);
            this.players = this.players.filter(
                (player) => player.name !== name
            );
        }
    };

    toJSON: () => RoomDTO = () => {
        return {
            players: toJS(this.players).map((player) => player.toJSON()),
            count: toJS(this.count),
            id: toJS(this.id),
        };
    };
}
