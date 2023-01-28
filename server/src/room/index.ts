import { autorun, IReactionDisposer, observable, toJS } from "mobx";
import { Player } from "./player";
import { RolePicker, roleTable } from "../charater/utils";
import { Stage } from "../state/stage";
import { v4 as uuidv4 } from "uuid";
import type { PlayerDTO } from "./player";
import type { Socket } from "socket.io";
import type { GameContext } from "../state";
export interface RoomDTO {
    players: PlayerDTO[];
    count: number;
    id: string | null;
}

export class Room {
    players = observable.array<Player>([], { deep: false });
    id = observable.box<string | null>(null);

    private disposers: IReactionDisposer[] = [];

    get count() {
        return this.players.length;
    }

    get onlineCount() {
        return this.players.filter((player) => player.connected).length;
    }

    constructor(public context: GameContext) {
        this.init();
    }

    init = () => {
        this.disposers.push(
            autorun(() => {
                this.notify();
            }),
            autorun(() => {
                if (this.context.state.stage === Stage.STARTED) {
                    this.startGame();
                }
            }),
            autorun(() => {
                if (
                    this.onlineCount === 0 &&
                    this.context.state.stage !== Stage.WAITING
                ) {
                    console.log(
                        "All user leaved but game is ongoing, cleanning stage"
                    );
                    this.context.state.updateStage(Stage.WAITING);
                }
            })
        );
    };

    destroy = () => {
        this.disposers.forEach((dispose) => dispose());
    };

    notify = () => {
        this.context.boradcast.emit("roomChange", this.toJSON());
    };

    reset = () => {
        this.destroy();
        this.init();
        this.context.state.updateStage(Stage.WAITING);
    };

    kickOffline = () => {
        this.players.replace(
            this.players.filter((player) => player.socket.connected)
        );
    };

    startGame = () => {
        const rolePicker = new RolePicker(this.players.length);
        this.id.set(uuidv4().toString());
        this.players.forEach((player) => {
            const role = rolePicker.pick();
            if (role) {
                const RoleConstructor = roleTable[role];
                player.role = new RoleConstructor(this);
            }
        });
        this.players.forEach((player) => {
            player.socket.emit("playerChange", player.toJSON());
        });
    };

    getExistingPlayer = (name: string) => {
        return this.players.find((player) => player.name === name);
    };

    joinPlayer = async (name: string, socket: Socket) => {
        const externalPlayerJoining =
            this.context.state.stage !== Stage.WAITING &&
            !this.getExistingPlayer(name);

        if (externalPlayerJoining) {
            socket.emit("kick");
            socket.disconnect(true);
        } else {
            await socket.join("avalon");
            let player = this.getExistingPlayer(name);
            if (player) {
                console.log("replacing player: " + name);
                if (player.socket.connected) {
                    player.socket.disconnect();
                }
                player.replace(name, socket);
                socket.emit("replace", { message: "NAME_EXIST" });
                // force notify the room players
                this.notify();
            } else {
                player = new Player(this.context, name, socket);
                this.players.push(player);
            }
            return player;
        }
    };

    kickPlayer = (name: string) => {
        const existingPlayer = this.getExistingPlayer(name);
        if (existingPlayer) {
            console.log("kicking player: " + name);
            existingPlayer.socket.emit("kick");
            existingPlayer.socket.disconnect(true);
            this.players.remove(existingPlayer);
        }
    };

    toJSON: () => RoomDTO = () => {
        return {
            players: toJS(this.players).map((player) =>
                player.toSensitiveJSON()
            ),
            count: this.count,
            id: this.id.get(),
        };
    };
}
