import React from "react";
import { Card, List, Space } from "antd";
import { taskStore } from "../store/task";
import { observer, Observer } from "mobx-react";
import { Vote } from "../../../server/src/task";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/statemachine/stage";

export const TaskHistory = observer(() => {
    return (
        <Card size="small">
            <List
                dataSource={Array.from(
                    taskStore.taskPoll?.history ?? []
                ).reverse()}
                renderItem={(task, index) => {
                    return (
                        <Observer>
                            {() => (
                                <List.Item
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    {roomStore.stage === Stage.ELECTION &&
                                    index === 0 ? (
                                        <div>等待投票任务队伍结果...</div>
                                    ) : (
                                        <>
                                            <Space>
                                                <div>做任务队伍：</div>
                                                {task.elections.players.map(
                                                    (player) => (
                                                        <div key={player}>
                                                            {player}
                                                        </div>
                                                    )
                                                )}
                                                <div>
                                                    （
                                                    {task.elections.result
                                                        ? "成功发车"
                                                        : "发车失败"}
                                                    ）
                                                </div>
                                            </Space>
                                            <Space>
                                                <div>同意该队伍：</div>
                                                {task.elections.votes
                                                    .filter(
                                                        (vote) =>
                                                            vote.vote ===
                                                            Vote.POSITIVE
                                                    )
                                                    .map((vote) => (
                                                        <div key={vote.player}>
                                                            {vote.player}
                                                        </div>
                                                    ))}
                                            </Space>
                                            <Space>
                                                <div>反对该队伍：</div>
                                                {task.elections.votes
                                                    .filter(
                                                        (vote) =>
                                                            vote.vote ===
                                                            Vote.NEGATIVE
                                                    )
                                                    .map((vote) => (
                                                        <div key={vote.player}>
                                                            {vote.player}
                                                        </div>
                                                    ))}
                                            </Space>
                                        </>
                                    )}
                                    {(roomStore.stage === Stage.POLLING ||
                                        roomStore.stage === Stage.ELECTION) &&
                                    index === 0 ? (
                                        <div>等待任务结果...</div>
                                    ) : (
                                        task.elections.result && (
                                            <Space>
                                                <div>
                                                    任务结果：
                                                    {task.poll.result
                                                        ? "成功"
                                                        : "失败"}
                                                </div>
                                                <div>
                                                    ✅:
                                                    {
                                                        task.poll.votes.filter(
                                                            (vote) =>
                                                                vote.vote ===
                                                                Vote.POSITIVE
                                                        ).length
                                                    }
                                                </div>
                                                <div>
                                                    ❎:
                                                    {
                                                        task.poll.votes.filter(
                                                            (vote) =>
                                                                vote.vote ===
                                                                Vote.NEGATIVE
                                                        ).length
                                                    }
                                                </div>
                                            </Space>
                                        )
                                    )}
                                </List.Item>
                            )}
                        </Observer>
                    );
                }}
            ></List>
        </Card>
    );
});
