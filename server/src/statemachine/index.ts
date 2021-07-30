import { TaskPoll, Vote } from "../task";
import { Room } from "../room";
import { Stage } from "./stage";
import type { Server, Socket } from "socket.io";

export class GameState {
    public currentStage: Stage = Stage.INITIAL;
    public room: Room;
    public taskPoll: TaskPoll;

    get boradcast() {
        return this.io.to("avalon");
    }

    constructor(private io: Server) {
        this.room = new Room(io);
        this.taskPoll = new TaskPoll(this.room);
    }

    joinPlayer = (name: string | string[] | undefined, socket: Socket) => {
        if (!name || name === "" || typeof name !== "string") {
            socket.disconnect(true);
        } else {
            const player = this.room.joinPlayer(name, socket);
            this.boradcast.emit("roomChange", this.room);
            socket.emit("stageChange", this.currentStage);
            socket.emit("taskChange", this.taskPoll);
            socket.emit("playerChange", player);
        }
    };

    startWaiting = () => {
        this.currentStage = Stage.WAITING;
        this.room.startWaiting();
        this.taskPoll.startWaiting();
        this.boradcast.emit("stageChange", this.currentStage);
        this.boradcast.emit("roomChange", this.room);
        this.boradcast.emit("taskChange", this.taskPoll);
    };

    startGame = () => {
        this.currentStage = Stage.STARTED;
        this.room.startGame();
        this.taskPoll.startGame();
        this.boradcast.emit("stageChange", this.currentStage);
        this.boradcast.emit("roomChange", this.room);
        this.boradcast.emit("taskChange", this.taskPoll);
    };

    startNewElection = (playersName: string[]) => {
        this.currentStage = Stage.ELECTION;
        this.taskPoll.startNewElection(playersName);
        this.boradcast.emit("stageChange", this.currentStage);
        this.boradcast.emit("taskChange", this.taskPoll);
    };

    voteForPlayersFrom = (playerName: string, vote: Vote) => {
        this.taskPoll.voteForPlayersFrom(playerName, vote);
        this.boradcast.emit("taskChange", this.taskPoll);
        if (this.taskPoll.currentElectionStage.type === "DONE") {
            if (this.taskPoll.currentElectionStage.result) {
                this.currentStage = Stage.POLLING;
            } else {
                this.currentStage = Stage.STARTED;
            }
            this.boradcast.emit("stageChange", this.currentStage);
        }
    };

    voteForTaskFrom = (playerName: string, vote: Vote) => {
        this.taskPoll.voteForTaskFrom(playerName, vote);
        this.boradcast.emit("taskChange", this.taskPoll);
        if (this.taskPoll.currentPollingStage.type === "DONE") {
            this.currentStage = Stage.STARTED;
            this.boradcast.emit("stageChange", this.currentStage);
        }
    };
}
