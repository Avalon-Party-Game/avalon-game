import type { Socket } from "socket.io";
import type { Character, ISerializable } from "../charater/base";

export class Player implements ISerializable {
    constructor(
        public socket: Socket,
        public name: string,
        public role?: Character
    ) {}

    toJSON() {
        return {
            name: this.name,
            role: this.role ?? null,
        };
    }
}
