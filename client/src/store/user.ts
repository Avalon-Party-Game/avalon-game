import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { PlayerDTO } from "../../../server/src/room/player";

interface IUserInfo {
    name: string;
    room: string;
}

class UserStore {
    userInfo: IUserInfo | null = null;
    playerInfo: PlayerDTO | null = null;

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: "UserStore",
            properties: ["userInfo"],
            storage: window.sessionStorage,
        });
    }

    updateUserInfo = (userInfo: IUserInfo) => {
        this.userInfo = userInfo;
    };

    updatePlayerInfo = (playerInfo: PlayerDTO) => {
        this.playerInfo = playerInfo;
    };
}

export const userStore = new UserStore();
