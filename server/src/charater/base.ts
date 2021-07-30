import type { PlayerDTO } from "../room/player";

export interface ISerializable {
    toJSON(): any;
}

export interface Character extends ISerializable {
    side: "JUSTICE" | "VILLAIN";
    type:
        | "MERLIN"
        | "PERCIVAL"
        | "MORGANA"
        | "ASSASIN"
        | "LOYAL_SERVANT"
        | "OBERON"
        | "MODRED"
        | "MINIONS";
    name: string;
    visible: PlayerDTO[];
}
