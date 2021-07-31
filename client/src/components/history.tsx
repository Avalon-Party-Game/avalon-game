import React from "react";
import { Card, List, Space } from "antd";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { taskStore } from "../store/task";
import { toJS } from "mobx";
import { Vote } from "../../../server/src/task";
import type { ITask } from "../../../server/src/task";

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

const TaskRecord = observer(
    ({ task, index }: { task: ITask; index: number }) => {
        const waiting =
            (roomStore.stage === Stage.POLLING ||
                roomStore.stage === Stage.ELECTION) &&
            index === 0;

        const electionPositiveCount = task.elections.votes.filter(
            (vote) => vote.vote === Vote.POSITIVE
        ).length;

        const electionResult = electionPositiveCount > roomStore.room.count / 2;

        return waiting ? (
            <div>等待任务结果...</div>
        ) : electionResult && task.poll ? (
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
        ) : null;
    }
);

export const TaskHistory = observer(() => {
    const history = Array.from(
        toJS(taskStore.taskPoll)?.history.reverse() ?? []
    );
    return (
        <Card size="small">
            <List
                dataSource={history}
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
