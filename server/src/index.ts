import express from "express";
import path from "path";
import { configure } from "mobx";
import { createServer } from "http";
import { GameContext } from "./state";
import { Server } from "socket.io";
import { Stage } from "./state/stage";
import type { Vote } from "./task";
import type { Player } from "./room/player";

configure({ enforceActions: "never" });

const app = express();

app.use(express.static(path.resolve(__dirname, "../../client/dist"))).get(
    "*",
    (_, res) => {
        res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
    }
);

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: true, methods: ["GET", "POST"] },
});
const context = new GameContext(io);

io.on("connection", (socket) => {
    const { name } = socket.handshake.query;
    if (!name || name === "" || typeof name !== "string") {
        // if name is not formatted, kick
        socket.emit("kick");
        socket.disconnect(true);
    } else {
        console.log("new connection: " + name?.toString());
        const player = context.room.joinPlayer(name, socket);
        if (player) {
            handlePlayerAction(player);
        }
        socket.on("disconnect", () => {
            context.room.notify();
            socket.leave("avalon");
            socket.offAny();
        });
    }
});

const handlePlayerAction = (player: Player) => {
    const socket = player.socket;
    const name = player.name;
    socket.on("startWaiting", () => context.state.updateStage(Stage.WAITING));
    socket.on("startGame", () => context.state.updateStage(Stage.STARTED));
    socket.on("startNewElection", context.taskPoll.startNewElection);
    socket.on("kickPlayer", context.room.kickPlayer);
    socket.on("kickOffline", context.room.kickOffline);
    socket.on("voteForPlayers", (vote: Vote) => {
        context.taskPoll.voteForPlayersFrom(name?.toString() ?? "", vote);
    });
    socket.on("voteForTask", (vote: Vote) => {
        context.taskPoll.voteForTaskFrom(name?.toString() ?? "", vote);
    });
};

server.listen(3100, () => {
    context.state.updateStage(Stage.WAITING);
    console.log("Server started at 3100");
});
