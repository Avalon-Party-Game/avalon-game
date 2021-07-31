import React from "react";
import { autorun } from "mobx";
import { Button, Card, Col, Collapse, Layout, Row, Space } from "antd";
import { Election } from "../components/election";
import { observer } from "mobx-react";
import { Polling } from "../components/polling";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { StartNewElection } from "../components/start-new-election";
import { TaskHistory } from "../components/history";
import { useHistory } from "react-router";
import { userStore } from "../store/user";
import { useSocketClient } from "../lib/socket";
import { Header } from "../components/layout/header";
import { GameLayout } from "../components/layout/layout";
import { Footer } from "../components/layout/footer";

export const InGame = observer(() => {
    const socketClient = useSocketClient();
    const history = useHistory();
    const [showElection, setShowElection] = React.useState(false);
    React.useEffect(
        () =>
            autorun(() => {
                if (
                    roomStore.stage === Stage.WAITING &&
                    userStore.userInfo?.room
                ) {
                    history.push(`/waiting/${userStore.userInfo.room}`);
                }
            }),
        [history]
    );
    const handleEndGame = React.useCallback(() => {
        socketClient.socket.emit("startWaiting");
    }, [socketClient]);
    return (
        <>
            <StartNewElection
                visible={showElection}
                onClose={() => setShowElection(false)}
            />
            <GameLayout>
                <Header>
                    <div>
                        <span>阿瓦隆 - </span>
                        {(() => {
                            switch (roomStore.stage) {
                                case Stage.STARTED:
                                    return "游戏开始";
                                case Stage.ONGOING:
                                    return "游戏继续";
                                case Stage.ELECTION:
                                    return "投票车队";
                                case Stage.POLLING:
                                    return "投票任务";
                            }
                        })()}
                    </div>
                </Header>
                <Layout.Content
                    style={{ overflow: "auto", paddingBottom: "40px" }}
                >
                    <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
                        <Collapse.Panel header="展示/隐藏 玩家信息" key="1">
                            <Card
                                size="small"
                                title={`${roomStore.playerInfo?.name} - 你扮演的角色：${roomStore.playerInfo?.role?.name}`}
                            >
                                <div>你视野中的人</div>
                                <Space>
                                    {roomStore.playerInfo?.role?.visible.map(
                                        (player) => (
                                            <div
                                                key={player.name}
                                                style={{ paddingTop: "5px" }}
                                            >
                                                <div>{player.name}</div>
                                                <div>
                                                    {player.roleName ?? "未知"}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </Space>
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel header="投票区" key="2">
                            {(() => {
                                switch (roomStore.stage) {
                                    case Stage.ELECTION:
                                        return <Election />;
                                    case Stage.POLLING:
                                        return <Polling />;
                                    default:
                                        return (
                                            <Card size="small">
                                                没有投票项目
                                            </Card>
                                        );
                                }
                            })()}
                        </Collapse.Panel>
                        <Collapse.Panel header="历史记录" key="3">
                            <TaskHistory />
                        </Collapse.Panel>
                    </Collapse>
                </Layout.Content>
                <Footer>
                    <Row gutter={6}>
                        <Col span={12}>
                            <Button
                                block
                                type="primary"
                                disabled={
                                    roomStore.stage === Stage.ELECTION ||
                                    roomStore.stage === Stage.POLLING
                                }
                                onClick={() => setShowElection(true)}
                            >
                                选择人员
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                block
                                type="primary"
                                onClick={handleEndGame}
                            >
                                结束游戏
                            </Button>
                        </Col>
                    </Row>
                </Footer>
            </GameLayout>
        </>
    );
});
