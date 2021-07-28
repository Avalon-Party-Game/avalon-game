import type { Player } from "../room/player";

export interface ISerializable {
    toJSON(): any;
}

export interface Character extends ISerializable {
    side: "JUSTICE" | "VILLAIN";
    type: "LOYAL_SERVANT" | "MERLIN" | "PERCIVAL" | "MORGANA";
    name: string;
    visible: Player[];
}
