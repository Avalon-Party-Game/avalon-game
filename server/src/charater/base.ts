import { Socket } from "socket.io";
import type { Room } from "../room";

export interface ISerializable {
    toJSON(): any;
}

interface Character extends ISerializable {
    side: "JUSTICE" | "VILLAIN";
}

export class LoyalServant implements Character {
    type = "LOYAL_SERVANT";
    name = "忠臣";

    side = "JUSTICE" as const;

    constructor(private room: Room) {}

    get seen() {
        return [];
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            side: this.side,
            seen: this.seen,
        };
    }
}

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
