import { LoyalServant } from "../charater/loyal-servant";
import { Player } from "./player";
import { RolePicker, roleTable } from "../charater/utils";
import type { ISerializable } from "../charater/base";
import type { PlayerDTO } from "./player";
import type { Server, Socket } from "socket.io";

export interface RoomDTO {
    players: PlayerDTO[];
    count: number;
}

export class Room implements ISerializable {
    private rolePicker = new RolePicker(this);
    players: Player[] = [];

    get count() {
        return this.players.length;
    }

    constructor(private io: Server) {}

    startWaiting = () => {
        this.rolePicker.reset();
        this.players = this.players.filter((player) => player.socket.connected);
    };

    startGame = () => {
        this.rolePicker.reset();
        this.players.forEach((player) => {
            const role = this.rolePicker.pick();
            if (role) {
                const RoleConstructor = roleTable[role];
                player.role = new RoleConstructor(this);
            }
        });
        this.players.forEach((player) => {
            player.socket.emit("playerChange", player);
        });
    };

    joinPlayer = (name: string, socket: Socket) => {
        const existingPlayer = this.players.find((player) => {
            return (
                player.name === name ||
                player.socket.request.headers.cookie ===
                    socket.request.headers.cookie
            );
        });
        if (existingPlayer) {
            console.log("replacing player: " + name);
            if (existingPlayer.socket.connected) {
                existingPlayer.socket.disconnect();
            }
            existingPlayer.socket = socket;
            existingPlayer.name = name;
            socket.emit("replace", { message: "NAME_EXIST" });
            return existingPlayer;
        } else {
            const player = new Player(socket, name);
            this.players.push(player);
            return player;
        }
    };

    reset = () => {
        this.players.forEach((player) => {
            if (player.socket.connected) {
                player.socket.disconnect();
            }
        });
        this.players = [];
        this.rolePicker.reset();
    };

    toJSON: () => RoomDTO = () => {
        return {
            players: this.players,
            count: this.count,
        };
    };
}
