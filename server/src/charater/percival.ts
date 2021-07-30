import type { Room } from "../room";
import type { PlayerDTO } from "../room/player";
import type { Character } from "./base";

export class Percival implements Character {
    type = "PERCIVAL" as const;
    side = "JUSTICE" as const;
    name = "派西维尔";

    constructor(private room: Room) {}

    get visible(): PlayerDTO[] {
        return this.room.players
            .filter(
                ({ role }) =>
                    role?.type === "MERLIN" || role?.type === "MORGANA"
            )
            .map(({ name }) => ({ name }));
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
