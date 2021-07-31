import type { Socket } from "socket.io";
import type { Character, ISerializable } from "../charater/base";

export interface PlayerDTO {
    name: string;
    role?: Character;
    roleName?: string;
    connected?: boolean;
}

export class Player implements ISerializable {
    constructor(
        public socket: Socket,
        public name: string,
        public role?: Character
    ) {}

    toJSON(): PlayerDTO {
        return {
            name: this.name,
            role: this.role,
            connected: this.socket.connected,
        };
    }
}
