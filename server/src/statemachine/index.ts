import { TaskPoll, Vote } from "../task";
import { Room } from "../room";
import { Stage } from "./stage";
import type { Server, Socket } from "socket.io";
import { autorun, makeAutoObservable } from "mobx";

export class GameContext {
    public currentStage = Stage.WAITING;
    public room: Room;
    public taskPoll: TaskPoll;

    get boradcast() {
        return this.io.to("avalon");
    }

    constructor(private io: Server) {
        makeAutoObservable(this, {
            room: false,
            taskPoll: false,
            boradcast: false,
        });
        autorun(() => {
            this.boradcast.emit("stageChange", this.currentStage);
        });
        this.taskPoll = new TaskPoll(this);
        this.room = new Room(this);
    }

    joinPlayer = (name: string | string[] | undefined, socket: Socket) => {
        if (!name || name === "" || typeof name !== "string") {
            socket.emit("kick");
            socket.disconnect(true);
        } else {
            const externalPlayerJoining =
                this.currentStage !== Stage.WAITING &&
                !this.room.getExistingPlayer(name);

            if (externalPlayerJoining) {
                socket.emit("kick");
                socket.disconnect(true);
            } else {
                const player = this.room.joinPlayer(name, socket);
                socket.emit("roomChange", this.room);
                socket.emit("stageChange", this.currentStage);
                socket.emit("playerChange", player);
            }
        }
    };

    startWaiting = () => {
        this.currentStage = Stage.WAITING;
    };

    startGame = () => {
        this.currentStage = Stage.STARTED;
    };

    kickPlayer = (name: string) => {
        this.room.kickPlayer(name);
    };

    kickOffline = () => {
        this.room.kickOffline();
    };

    startNewElection = (playersName: string[]) => {
        this.currentStage = Stage.ELECTION;
        this.taskPoll.startNewElection(playersName);
    };

    voteForPlayersFrom = (playerName: string, vote: Vote) => {
        this.taskPoll.voteForPlayersFrom(playerName, vote);
        if (this.taskPoll.currentElectionStage.type === "DONE") {
            if (this.taskPoll.currentElectionStage.result) {
                this.currentStage = Stage.POLLING;
            } else {
                this.currentStage = Stage.ONGOING;
            }
        }
    };

    voteForTaskFrom = (playerName: string, vote: Vote) => {
        this.taskPoll.voteForTaskFrom(playerName, vote);
        if (this.taskPoll.currentPollingStage.type === "DONE") {
            this.currentStage = Stage.ONGOING;
        }
    };
}
