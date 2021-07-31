import React from "react";
import { Card, List, Space } from "antd";
import { toJS } from "mobx";
import { taskStore } from "../store/task";
import { observer } from "mobx-react";
import { ITask, Vote } from "../../../server/src/task";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/statemachine/stage";

const ElectionRecord = observer(
    ({ task, index }: { task: ITask; index: number }) => {
        const pending = roomStore.stage === Stage.ELECTION && index === 0;
        const positiveCount = task.elections.votes.filter(
            (vote) => vote.vote === Vote.POSITIVE
        ).length;
        const result = positiveCount > roomStore.room.count / 2;
        return pending ? (
            <div>等待投票任务队伍结果...</div>
        ) : (
            <>
                <Space>
                    <div>做任务队伍：</div>
                    {task.elections.players.map((player) => (
                        <div key={player}>{player}</div>
                    ))}
                    <div>（{result ? "成功发车" : "发车失败"}）</div>
                </Space>
                <Space>
                    <div>同意该队伍：</div>
                    {task.elections.votes
                        .filter((vote) => vote.vote === Vote.POSITIVE)
                        .map((vote) => (
                            <div key={vote.player}>{vote.player}</div>
                        ))}
                </Space>
                <Space>
                    <div>反对该队伍：</div>
                    {task.elections.votes
                        .filter((vote) => vote.vote === Vote.NEGATIVE)
                        .map((vote) => (
                            <div key={vote.player}>{vote.player}</div>
                        ))}
                </Space>
            </>
        );
    }
);

const TaskRecord = observer(({ task, index }: { task: ITask; index: number }) =>
    (roomStore.stage === Stage.POLLING || roomStore.stage === Stage.ELECTION) &&
    index === 0 ? (
        <div>等待任务结果...</div>
    ) : task.poll ? (
        <Space>
            <div>任务结果：</div>
            <div>
                有
                {
                    task.poll.votes.filter(
                        (vote) => vote.vote === Vote.NEGATIVE
                    ).length
                }
                人破坏
            </div>
        </Space>
    ) : null
);

export const TaskHistory = observer(() => {
    return (
        <Card size="small">
            <List
                dataSource={Array.from(
                    toJS(taskStore.taskPoll)?.history ?? []
                ).reverse()}
                renderItem={(task, index) => (
                    <List.Item
                        style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        <ElectionRecord task={task} index={index} />
                        <TaskRecord task={task} index={index} />
                    </List.Item>
                )}
            ></List>
        </Card>
    );
});
