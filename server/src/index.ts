import { Server } from "socket.io";
import { Player } from "./charater/base";
import { room } from "./room";

const io = new Server();

io.on("connection", (socket) => {
    socket.join("avalon");
    const { name } = socket.handshake.query;
    console.log("joining: " + name?.toString());

    if (!name || name === "" || typeof name !== "string") {
        socket.disconnect(true);
    } else {
        const existingPlayer = room.players.find(
            (player) => player.name === name
        );
        if (existingPlayer) {
            console.log("replacing player: " + name);
            if (existingPlayer.socket.connected) {
                existingPlayer.socket.disconnect();
            }
            existingPlayer.socket = socket;
            socket.emit("replace", { message: "NAME_EXIST" });
        } else {
            room.players.push(new Player(socket, name));
        }
        io.to("avalon").emit("roomChange", JSON.stringify(room));
    }

    socket.on("startGame", () => {
        room.startGame();
        io.to("avalon").emit("roomChange", JSON.stringify(room));
    });
});

io.listen(3100);
