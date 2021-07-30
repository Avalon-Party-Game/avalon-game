import type { ISerializable } from "../charater/base";
import type { Room } from "../room";

export enum Vote {
    POSITIVE,
    NEGATIVE,
}

export interface IVote {
    player: string;
    vote: Vote;
}

export interface ITask {
    // select players to execute task
    elections: {
        players: string[];
        votes: IVote[];
        result?: boolean;
    };

    // players who can execute task vote for task
    poll: {
        votes: IVote[];
        result?: boolean;
    };
}

export type TaskDTO = ReturnType<TaskPoll["toJSON"]>;

export class TaskPoll implements ISerializable {
    constructor(private room: Room) {}

    history: Array<ITask> = [];

    get currentRound(): ITask | null {
        return this.history[this.history.length - 1] ?? null;
    }

    get currentElectionStage() {
        if (this.currentRound && this.currentRound.elections.players.length) {
            if (this.room.count > this.currentRound.elections.votes.length) {
                const pending = this.room.players
                    .filter(
                        (player) =>
                            !this.currentRound?.elections.votes.find(
                                (vote) => vote.player === player.name
                            )
                    )
                    .map((player) => player.name);
                return { type: "PENDING", pending } as const;
            } else {
                const votes = this.currentRound.elections.votes;
                const positiveCount = votes.filter(
                    (vote) => vote.vote === Vote.POSITIVE
                ).length;
                const result = positiveCount > this.room.count / 2;
                this.currentRound.elections.result = result;
                return { type: "DONE", votes, result } as const;
            }
        } else {
            return { type: "INITIAL" } as const;
        }
    }

    get currentPollingStage() {
        if (this.currentRound && this.currentElectionStage.type === "DONE") {
            if (
                this.currentRound.elections.players.length >
                this.currentRound.poll.votes.length
            ) {
                const pending = this.currentRound.elections.players.filter(
                    (player) =>
                        !this.currentRound?.poll.votes.find(
                            (vote) => vote.player === player
                        )
                );
                return { type: "PENDING", pending } as const;
            } else {
                const votes = this.currentRound.poll.votes.map(
                    // hide voted player name when polling
                    (vote) => vote.vote
                );

                const positiveCount = votes.filter(
                    (vote) => vote === Vote.POSITIVE
                ).length;

                const result =
                    positiveCount >
                    this.currentRound.elections.players.length / 2;

                this.currentRound.poll.result = result;
                return { type: "DONE", votes, result } as const;
            }
        } else {
            return { type: "INITIAL" } as const;
        }
    }

    voteForPlayersFrom = (player: string, vote: Vote) => {
        this.currentRound?.elections.votes.push({ player, vote });
    };

    voteForTaskFrom = (player: string, vote: Vote) => {
        this.currentRound?.poll.votes.push({ player, vote });
    };

    startNewElection = (players: string[]) => {
        this.history.push({
            elections: { players, votes: [] },
            poll: { votes: [] },
        });
    };

    startWaiting = () => {
        this.history = [];
    };

    startGame = () => {
        this.history = [];
    };

    toJSON = () => {
        return {
            history: this.history,
            currentRound: this.currentRound,
            currentElectionStage: this.currentElectionStage,
            currentPollingStage: this.currentPollingStage,
        };
    };
}
