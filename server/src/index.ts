import express from "express";
import path from "path";
import { configure } from "mobx";
import { createServer } from "http";
import { GameContext } from "./state";
import { Server } from "socket.io";

configure({ enforceActions: "never" });

const app = express();

const server = createServer(app);

const io = new Server(server);

const context = new GameContext(io);

const serveWebPage = () => {
    app.use(express.static(path.resolve(__dirname, "../../client/dist"))).get(
        "*",
        (_, res) => {
            res.sendFile(
                path.resolve(__dirname, "../../client/dist/index.html")
            );
        }
    );
};

const serveWebSocket = () => {
    io.on("connection", async (socket) => {
        const { name } = socket.handshake.query;
        if (!name || name === "" || typeof name !== "string") {
            // if name is not formatted, kick
            socket.emit("kick");
            socket.disconnect(true);
        } else {
            console.log("new connection: " + name?.toString());
            const player = await context.room.joinPlayer(name, socket);
            if (player) player.handleAction();
        }
    });
};

serveWebPage();
serveWebSocket();

server.listen(3100, () => {
    console.log("Server started at 3100");
});
