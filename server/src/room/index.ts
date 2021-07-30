import { LoyalServant } from "../charater/loyal-servant";
import { Player } from "./player";
import type { ISerializable } from "../charater/base";
import type { PlayerDTO } from "./player";
import type { Server, Socket } from "socket.io";

export interface RoomDTO {
    players: PlayerDTO[];
    count: number;
}

export class Room implements ISerializable {
    players: Player[] = [];

    get count() {
        return this.players.length;
    }

    constructor(private io: Server) {}

    startWaiting = () => {
        this.players = this.players.filter((player) => player.socket.connected);
    };

    startGame = () => {
        this.players.forEach(
            (player) => (player.role = new LoyalServant(this))
        );
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
        } else {
            this.players.push(new Player(socket, name));
        }
    };

    reset = () => {
        this.players.forEach((player) => {
            if (player.socket.connected) {
                player.socket.disconnect();
            }
        });
        this.players = [];
    };

    toJSON: () => RoomDTO = () => {
        return {
            players: this.players,
            count: this.count,
        };
    };
}
