import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class ConfigStore {
    activePanel: string | string[] = ["1", "2", "3"];

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: "ConfigStore",
            properties: ["activePanel"],
            storage: window.sessionStorage,
        });
    }

    updateActivePanel = (value: string | string[]) => {
        this.activePanel = value;
    };
}

export const configStore = new ConfigStore();
