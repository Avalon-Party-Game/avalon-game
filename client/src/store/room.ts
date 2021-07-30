import type { RoomDTO } from "../../../server/src/room";
import { makeAutoObservable } from "mobx";
import { Stage } from "../../../server/src/statemachine/stage";

class RoomStore {
    stage: Stage = Stage.WAITING;
    room: RoomDTO = {
        players: [],
        count: 0,
    };

    get canStartGame() {
        return this.room.count >= 6 && this.room.count <= 10;
    }
    
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
