import React from "react";
import { reaction } from "mobx";
import { Button, Card, Col, message, Row } from "antd";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { taskStore } from "../store/task";
import { useSocketClient } from "../lib/socket";
import { Vote } from "../../../server/src/task";

export const Polling = observer(() => {
    const socketClient = useSocketClient();

    const showPolling = roomStore.stage === Stage.POLLING;

    const currentRoundIncludesMe =
        taskStore.taskPoll?.currentRound?.elections.players.includes(
            roomStore.playerInfo?.name ?? ""
        );

    const myPollingHasBeenPlaced =
        currentRoundIncludesMe &&
        taskStore.taskPoll?.currentPollingStage.type === "PENDING" &&
        !taskStore.taskPoll.currentPollingStage.pending.includes(
            roomStore.playerInfo?.name ?? ""
        );

    const pendingOthers = currentRoundIncludesMe
        ? myPollingHasBeenPlaced
        : true;

    const handleVote = React.useCallback(
        (vote: Vote) => {
            socketClient.socket.emit("voteForTask", vote);
        },
        [socketClient]
    );

    React.useEffect(
        () =>
            reaction(
                () => taskStore.taskPoll?.currentPollingStage.type,
                (curr, prev) => {
                    if (prev === "PENDING" && curr === "DONE") {
                        message.info(
                            `投票结果: ${
                                taskStore.taskPoll?.currentPollingStage.result
                                    ? "成功"
                                    : "失败"
                            }`
                        );
                    }
                }
            ),
        []
    );

    return showPolling ? (
        <Card title="请选择任务成功或失败" size="small">
            {pendingOthers ? (
                <div>等待其他玩家投票...</div>
            ) : (
                <>
                    <Row gutter={12} style={{ padding: "10px 0" }}>
                        <Col span={12}>
                            <Button
                                block
                                size="large"
                                type="ghost"
                                danger
                                onClick={() => handleVote(Vote.NEGATIVE)}
                            >
                                失败
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
                                成功
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Card>
    ) : null;
});
