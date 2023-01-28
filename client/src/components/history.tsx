import React from "react";
import styled from "styled-components";
import { Card, List } from "antd";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { Stage } from "../../../server/src/state/stage";
import { taskStore } from "../store/task";
import { toJS } from "mobx";
import { Vote } from "../../../server/src/task";
import type { ITask } from "../../../server/src/task";

const RecordStyle = styled.p`
    margin-bottom: 0;
    &:not(:last-child) {
        margin-bottom: 0.5em;
    }
    > span.player {
        margin-right: 10px;
    }
`;

const ElectionRecord = observer(
    ({ task, index }: { task: ITask; index: number }) => {
        const pending = roomStore.stage === Stage.ELECTION && index === 0;

        const positiveCount = task.elections.votes.filter(
            (vote) => vote.vote === Vote.POSITIVE
        ).length;

        const result = positiveCount > roomStore.room.count / 2;

        return pending ? (
            <RecordStyle>等待投票任务队伍结果...</RecordStyle>
        ) : (
            <>
                <RecordStyle>
                    <span>组队：</span>
                    {task.elections.players.map((player) => (
                        <span className="player" key={player}>
                            {player}
                        </span>
                    ))}
                    <span>（{result ? "成功发车" : "发车失败"}）</span>
                </RecordStyle>
                <RecordStyle>
                    <span>同意组队：</span>
                    {task.elections.votes
                        .filter((vote) => vote.vote === Vote.POSITIVE)
                        .map((vote) => (
                            <span className="player" key={vote.player}>
                                {vote.player}
                            </span>
                        ))}
                </RecordStyle>
                <RecordStyle>
                    <span>反对组队：</span>
                    {task.elections.votes
                        .filter((vote) => vote.vote === Vote.NEGATIVE)
                        .map((vote) => (
                            <span className="player" key={vote.player}>
                                {vote.player}
                            </span>
                        ))}
                </RecordStyle>
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

        const taskPositiveCount = task.poll.votes.filter(
            (vote) => vote.vote === Vote.POSITIVE
        ).length;

        const taskResult = taskPositiveCount > task.poll.votes.length / 2;

        return waiting ? (
            <div>等待任务结果...</div>
        ) : electionResult && task.poll ? (
            <RecordStyle>
                <span>任务结果：{taskResult ? "成功" : "失败"}，</span>
                <span>
                    有
                    {
                        task.poll.votes.filter(
                            (vote) => vote.vote === Vote.NEGATIVE
                        ).length
                    }
                    人破坏
                </span>
            </RecordStyle>
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
