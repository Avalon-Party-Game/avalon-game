import { makeAutoObservable } from "mobx";
import type { TaskDTO } from "../../../server/src/task";

class TaskStore {
    taskPoll: TaskDTO | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    updateTaskPoll = (taskPoll: TaskDTO) => {
        this.taskPoll = taskPoll;
    };
}

export const taskStore = new TaskStore();
