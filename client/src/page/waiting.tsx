import React from "react";
import { autorun } from "mobx";
import { Button, Layout } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/statemachine/stage";
import { useHistory } from "react-router";
import { useSocketClient } from "../lib/socket";

export const WaitingRoom = () => {
    const history = useHistory();
    const socketClient = useSocketClient();

    const handleStart = React.useCallback(() => {
        socketClient.socket.emit("startGame");
    }, []);

    React.useEffect(() => {
        return autorun(() => {
            if (roomStore.stage === Stage.STARTED) {
                history.push("/in-game");
            }
        });
    }, []);

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Header>
                <h1>Waiting</h1>
            </Layout.Header>
            <Layout.Content style={{ padding: "30px" }}>
                <Observer>
                    {() => (
                        <>
                            {roomStore.room.players.map((player) => (
                                <div key={player.name}>{player.name}</div>
                            ))}
                        </>
                    )}
                </Observer>
            </Layout.Content>
            <Layout.Footer>
                <Observer>
                    {() => (
                        <Button
                            disabled={
                                roomStore.room.count < 6 ||
                                roomStore.room.count > 10
                            }
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={handleStart}
                        >
                            Start
                        </Button>
                    )}
                </Observer>
            </Layout.Footer>
        </Layout>
    );
};
