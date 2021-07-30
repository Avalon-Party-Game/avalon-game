import type { Room } from "../room";
import type { PlayerDTO } from "../room/player";
import type { Character } from "./base";

export class Oberon implements Character {
    type = "OBERON" as const;
    side = "VILLAIN" as const;
    name = "奥伯伦";

    constructor(private room: Room) {}

    get visible(): PlayerDTO[] {
        return [];
    }

    toJSON = () => {
        return {
            type: this.type,
            name: this.name,
            side: this.side,
            visible: this.visible,
        };
    };
}
