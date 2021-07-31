import React from "react";
import { reaction } from "mobx";
import { Button, Card, Col, message, Row, Space } from "antd";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { taskStore } from "../store/task";
import { useSocketClient } from "../lib/socket";
import { Vote } from "../../../server/src/task";

export const Election = observer(() => {
    const socketClient = useSocketClient();

    const showElection = roomStore.stage === Stage.ELECTION;

    const pendingOthers =
        taskStore.taskPoll?.currentElectionStage.type === "PENDING" &&
        !taskStore.taskPoll.currentElectionStage.pending.includes(
            roomStore.playerInfo?.name ?? ""
        );

    const handleVote = React.useCallback(
        (vote: Vote) => {
            socketClient.socket.emit("voteForPlayers", vote);
        },
        [socketClient]
    );

    React.useEffect(
        () =>
            reaction(
                () => taskStore.taskPoll?.currentElectionStage.type,
                (curr, prev) => {
                    if (prev === "PENDING" && curr === "DONE") {
                        message.info(
                            `投票结果: ${
                                taskStore.taskPoll?.currentElectionStage.result
                                    ? "成功"
                                    : "失败"
                            }`
                        );
                    }
                }
            ),
        []
    );

    return showElection ? (
        <Card title="你是否同意下列玩家执行任务？" size="small">
            {pendingOthers ? (
                <div>等待其他玩家投票...</div>
            ) : (
                <>
                    <Space>
                        {taskStore.taskPoll?.currentRound?.elections.players.map(
                            (player) => (
                                <div key={player}>{player}</div>
                            )
                        )}
                    </Space>
                    <Row gutter={12} style={{ padding: "10px 0" }}>
                        <Col span={12}>
                            <Button
                                block
                                size="large"
                                type="ghost"
                                danger
                                onClick={() => handleVote(Vote.NEGATIVE)}
                            >
                                反对
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                block
                                size="large"
                                type="primary"
                                ghost
                                onClick={() => handleVote(Vote.POSITIVE)}
                            >
                                同意
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Card>
    ) : null;
});
