import type { RoomDTO } from "../../../server/src/room";
import { makeAutoObservable } from "mobx";
import { Stage } from "../../../server/src/statemachine/stage";

class RoomStore {
    stage: Stage = Stage.INITIAL;
    room: RoomDTO = {
        players: [],
        count: 0,
    };

    constructor() {
        makeAutoObservable(this);
    }

    updateRoom(room: RoomDTO) {
        this.room = room;
    }

    updateStage(stage: Stage) {
        this.stage = stage;
    }
}

export const roomStore = new RoomStore();
