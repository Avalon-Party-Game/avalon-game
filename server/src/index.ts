import { Server } from "socket.io";
import { GameState } from "./statemachine";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
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
});

httpServer.listen(3100, () => {
    gameState.startWaiting();
});
