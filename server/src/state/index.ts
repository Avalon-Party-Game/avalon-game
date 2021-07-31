import { Room } from "../room";
import { GameState } from "./stage";
import { TaskPoll } from "../task";
import type { Server } from "socket.io";

export class GameContext {
    public state = new GameState(this);
    public room = new Room(this);
    public taskPoll = new TaskPoll(this);

    get boradcast() {
        return this.io.to("avalon");
    }

    constructor(public io: Server) {}
}
