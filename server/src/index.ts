import { Server } from "socket.io";
import { GameState } from "./statemachine";
import { createServer } from "http";
import type { Vote } from "./task";
import express from "express";
import path from "path";

const app = express();
app.use(
    express.static(path.resolve(__dirname, "../../client/dist"))
).get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
});

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: true, methods: ["GET", "POST"] },
});
const gameState = new GameState(io);

io.on("connection", (socket) => {
    const { name } = socket.handshake.query;
    console.log("new connection: " + name?.toString());
    socket.join("avalon");
    gameState.joinPlayer(name, socket);
    socket.on("startWaiting", gameState.startWaiting);
    socket.on("startGame", gameState.startGame);
    socket.on("startNewElection", gameState.startNewElection);
    socket.on("voteForPlayers", (vote: Vote) => {
        gameState.voteForPlayersFrom(name?.toString() ?? "", vote);
    });
    socket.on("voteForTask", (vote: Vote) => {
        gameState.voteForTaskFrom(name?.toString() ?? "", vote);
    });
});

server.listen(3100, () => {
    gameState.startWaiting();
});
