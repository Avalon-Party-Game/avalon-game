import React from "react";
import UserDeleteOutlined from "@ant-design/icons/UserDeleteOutlined";
import { autorun, toJS } from "mobx";
import { Button, Layout, List, Row, Col } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/statemachine/stage";
import { useHistory } from "react-router";
import { useSocketClient } from "../lib/socket";
import WifiOutlined from "@ant-design/icons/WifiOutlined";
import DisconnectOutlined from "@ant-design/icons/DisconnectOutlined";

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
        <Layout style={{ height: "100vh" }}>
            <Layout.Header>
                <h1>等待中...</h1>
            </Layout.Header>
            <Layout.Content style={{ padding: "30px" }}>
                <Observer>
                    {() => (
                        <List
                            bordered
                            dataSource={toJS(roomStore.room).players}
                            renderItem={(player) => (
                                <List.Item
                                    extra={
                                        <Button
                                            icon={
                                                <UserDeleteOutlined
                                                    onClick={() =>
                                                        handleKickPlayer(
                                                            player.name
                                                        )
                                                    }
                                                />
                                            }
                                        ></Button>
                                    }
                                >
                                    <span>
                                        {player.connected ? (
                                            <WifiOutlined />
                                        ) : (
                                            <DisconnectOutlined />
                                        )}{" "}
                                        {player.name}
                                    </span>
                                </List.Item>
                            )}
                        />
                    )}
                </Observer>
            </Layout.Content>
            <Layout.Footer>
                <Row gutter={12}>
                    <Col span={12}>
                        <Button block onClick={handleKickOffline}>
                            清除不在线玩家
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Observer>
                            {() => (
                                <Button
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
            </Layout.Footer>
        </Layout>
    );
};
