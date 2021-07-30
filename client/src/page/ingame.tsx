import React from "react";
import { Button, Layout, Card, Collapse, List, Row, Col } from "antd";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { userStore } from "../store/user";
import { Stage } from "../../../server/src/statemachine/stage";
import { useHistory } from "react-router";
import { StartNewElection } from "../components/start-new-election";
import { Election } from "../components/election";
import { useSocketClient } from "../lib/socket";
import { Polling } from "../components/polling";
import { TaskHistory } from "../components/history";

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
        []
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
            <Layout style={{ height: "100vh" }}>
                <Layout.Header>
                    <h1>
                        {(() => {
                            switch (roomStore.stage) {
                                case Stage.STARTED:
                                    return "游戏开始";
                                case Stage.ELECTION:
                                    return "投票选出执行任务的人";
                                case Stage.POLLING:
                                    return "投票任务成功或失败";
                            }
                        })()}
                    </h1>
                </Layout.Header>
                <Layout.Content style={{ overflow: "auto", paddingBottom: '40px' }}>
                    <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
                        <Collapse.Panel header="展示/隐藏 玩家信息" key="1">
                            <Card
                                size="small"
                                title={`${userStore.playerInfo?.name} - 你扮演的角色：${userStore.playerInfo?.role?.name}`}
                            >
                                <div>你视野中的人</div>
                                <List
                                    dataSource={
                                        userStore.playerInfo?.role?.visible
                                    }
                                    renderItem={(player) => (
                                        <List.Item>
                                            <Card
                                                size="small"
                                                title={player.name}
                                            >
                                                {player.roleName ?? "未知角色"}
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel header="投票区" key="2">
                            <Election />
                            <Polling />
                        </Collapse.Panel>
                        <Collapse.Panel header="历史记录" key="3">
                            <TaskHistory />
                        </Collapse.Panel>
                    </Collapse>
                </Layout.Content>
                <Layout.Footer>
                    <Row gutter={6}>
                        <Col span={12}>
                            <Button
                                block
                                type="primary"
                                disabled={roomStore.stage !== Stage.STARTED}
                                onClick={() => setShowElection(true)}
                            >
                                选择执行任务的人员
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
                </Layout.Footer>
            </Layout>
        </>
    );
});
