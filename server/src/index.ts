import { Server } from "socket.io";
import { GameContext } from "./statemachine";
import { createServer } from "http";
import type { Vote } from "./task";
import express from "express";
import path from "path";
import { configure } from "mobx";

configure({ enforceActions: "never" });

const app = express();

app.use(express.static(path.resolve(__dirname, "../../client/dist"))).get(
    "*",
    (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
    }
);

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: true, methods: ["GET", "POST"] },
});
const gameState = new GameContext(io);

io.on("connection", (socket) => {
    const { name } = socket.handshake.query;
    console.log("new connection: " + name?.toString());
    socket.join("avalon");
    gameState.joinPlayer(name, socket);
    socket.on("startWaiting", gameState.startWaiting);
    socket.on("startGame", gameState.startGame);
    socket.on("startNewElection", gameState.startNewElection);
    socket.on("kickPlayer", gameState.kickPlayer);
    socket.on("kickOffline", gameState.kickOffline);
    socket.on("voteForPlayers", (vote: Vote) => {
        gameState.voteForPlayersFrom(name?.toString() ?? "", vote);
    });
    socket.on("voteForTask", (vote: Vote) => {
        gameState.voteForTaskFrom(name?.toString() ?? "", vote);
    });
    socket.on("disconnect", () => {
        gameState.room.notify();
        socket.leave("avalon");
        socket.offAny();
    });
});

server.listen(3100, () => {
    gameState.startWaiting();
    console.log("Server started at 3100");
});
