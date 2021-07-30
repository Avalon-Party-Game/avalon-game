import { Assasin } from './assasin';
import { LoyalServant } from './loyal-servant';
import { Merlin } from './merlin';
import { Modred } from './modred';
import { Morgana } from './morgana';
import { Oberon } from './oberon';
import { Percival } from './percival';
import type { Room } from "../room";
import type { Character } from "./base";
import { Minions } from './minions';

const shuffleArray = <T>(inputArray: Array<T>) => {
    const array = Array.from(inputArray);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export const roleTable = {
    MERLIN: Merlin,
    PERCIVAL: Percival,
    MORGANA: Morgana,
    ASSASIN: Assasin,
    LOYAL_SERVANT: LoyalServant,
    OBERON: Oberon,
    MODRED: Modred,
    MINIONS: Minions,
};

export const arrangementTable: { [x: number]: Character["type"][] } = {
    1: ["MERLIN"], // used for debugging
    2: ["MERLIN", "MINIONS"], // used for debugging
    6: [
        "MERLIN",
        "PERCIVAL",
        "MORGANA",
        "ASSASIN",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
    ],
    7: [
        "MERLIN",
        "PERCIVAL",
        "MORGANA",
        "ASSASIN",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "OBERON",
    ],
    8: [
        "MERLIN",
        "PERCIVAL",
        "MORGANA",
        "ASSASIN",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "MINIONS",
    ],
    9: [
        "MERLIN",
        "PERCIVAL",
        "MORGANA",
        "ASSASIN",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "MODRED",
    ],
    10: [
        "MERLIN",
        "PERCIVAL",
        "MORGANA",
        "ASSASIN",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "LOYAL_SERVANT",
        "OBERON",
        "MODRED",
    ],
};

export class RolePicker {
    role: Character["type"][] = [];

    constructor(private room: Room) {}

    reset = () => {
        this.role = shuffleArray(arrangementTable[this.room.count] ?? []);
    };

    pick = () => {
        return this.role.pop();
    };
}
