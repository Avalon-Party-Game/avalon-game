import type { Room } from "../room";
import type { PlayerDTO } from "../room/player";
import type { Character } from "./base";

export class Modred implements Character {
    type = "MODRED" as const;
    side = "VILLAIN" as const;
    name = "莫德雷德";

    constructor(private room: Room) {}

    get visible(): PlayerDTO[] {
        return this.room.players
            .filter(
                ({ role }) =>
                    role?.side === "VILLAIN" &&
                    role.type !== "OBERON" &&
                    role.type !== "MODRED"
            )
            .map(({ name, role }) => ({ name, roleName: role?.name }));
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
