import { makeAutoObservable } from "mobx";
import { Stage } from "../../../server/src/state/stage";
import type { RoomDTO } from "../../../server/src/room";
import type { PlayerDTO } from "../../../server/src/room/player";

class RoomStore {
    stage: Stage = Stage.WAITING;
    room: RoomDTO = {
        players: [],
        count: 0,
    };
    playerInfo: PlayerDTO | null = null;

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

    updatePlayerInfo = (playerInfo: PlayerDTO | null) => {
        this.playerInfo = playerInfo;
    };
}

export const roomStore = new RoomStore();
