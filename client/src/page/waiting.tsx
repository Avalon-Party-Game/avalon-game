import React from "react";
import { autorun } from "mobx";
import { Button, Col, Layout, Row } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { useHistory } from "react-router";
import { useSocketClient } from "../lib/socket";
import { Header } from "../components/layout/header";
import { GameLayout } from "../components/layout/layout";
import { Footer } from "../components/layout/footer";
import { PlayerList } from "../components/player-list";

export const WaitingRoom = () => {
    const history = useHistory();
    const socketClient = useSocketClient();

    const handleStart = React.useCallback(() => {
        socketClient.socket.emit("startGame");
    }, [socketClient.socket]);

    const handleKickPlayer = React.useCallback(
        (playerName: string) => {
            socketClient.socket.emit("kickPlayer", playerName);
        },
        [socketClient.socket]
    );

    const handleKickOffline = React.useCallback(() => {
        socketClient.socket.emit("kickOffline");
    }, [socketClient.socket]);

    React.useEffect(() => {
        return autorun(() => {
            if (
                roomStore.stage === Stage.STARTED ||
                roomStore.stage === Stage.ONGOING
            ) {
                history.push("/in-game");
            }
        });
    }, [history]);

    return (
        <GameLayout>
            <Header>
                <div>阿瓦隆 - 等待玩家</div>
            </Header>
            <Layout.Content style={{ padding: "30px" }}>
                <PlayerList onKickPlayer={handleKickPlayer} />
            </Layout.Content>
            <Footer>
                <Row gutter={12}>
                    <Col span={12}>
                        <Button
                            ghost
                            danger
                            size="large"
                            block
                            onClick={handleKickOffline}
                        >
                            清除不在线玩家
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Observer>
                            {() => (
                                <Button
                                    ghost
                                    size="large"
                                    disabled={!roomStore.canStartGame}
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={handleStart}
                                >
                                    开始游戏
                                </Button>
                            )}
                        </Observer>
                    </Col>
                </Row>
            </Footer>
        </GameLayout>
    );
};
