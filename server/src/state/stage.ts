import { autorun, makeAutoObservable } from "mobx";
import { GameContext } from ".";

export enum Stage {
    WAITING,
    STARTED,
    ONGOING,
    ELECTION,
    POLLING,
}

export class GameState {
    stage = Stage.WAITING;

    constructor(public context: GameContext) {
        makeAutoObservable(this, { context: false });
        autorun(() => {
            this.context.boradcast.emit("stageChange", this.stage);
        });
    }

    updateStage = (stage: Stage) => {
        this.stage = stage;
    };
}
