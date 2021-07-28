import { Button } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useSocketClient } from "./lib/socket";

export const WaitingRoom = () => {
    const { name } = useParams<{ name: string; room: string }>();
    const socketClient = useSocketClient();

    const handleRoomChange = React.useCallback((newRoom: any) => {
        console.log(newRoom);
    }, []);

    const handleStart = React.useCallback(() => {
        socketClient.socket.emit("startGame");
    }, []);

    React.useEffect(() => {
        socketClient.socket.io.opts.query = { name };
        socketClient.socket.connect();
        socketClient.socket.on("roomChange", handleRoomChange);

        return () => {
            socketClient.socket.off("roomChange");
        };
    }, []);

    return (
        <div>
            <Button onClick={handleStart}>Start</Button>
        </div>
    );
};
