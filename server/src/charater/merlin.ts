import type { Room } from "../room";
import type { PlayerDTO } from "../room/player";
import type { Character } from "./base";

export class Merlin implements Character {
    type = "MERLIN" as const;
    side = "JUSTICE" as const;
    name = "梅林";

    constructor(private room: Room) {}

    get visible(): PlayerDTO[] {
        return this.room.players
            .filter(
                ({ role }) =>
                    role?.side === "VILLAIN" && role?.type !== "MODRED"
            )
            .map(({ name }) => ({ name, roleName: "反派" }));
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
