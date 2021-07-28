import { ISerializable, LoyalServant, Player } from "../charater/base";

export class Room implements ISerializable {
    players: Player[] = [];

    get count() {
        return this.players.length;
    }

    startGame() {
        this.players.forEach((player) => {
            player.role = new LoyalServant(this);
        });
    }

    reset() {
        this.players.forEach((player) => {
            if (player.socket.connected) {
                player.socket.disconnect();
            }
        });
        this.players = [];
    }

    toJSON() {
        return {
            players: this.players,
            count: this.count,
        };
    }
}

export const room = new Room();
