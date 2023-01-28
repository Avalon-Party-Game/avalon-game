import DisconnectOutlined from "@ant-design/icons/DisconnectOutlined";
import React from "react";
import UserDeleteOutlined from "@ant-design/icons/UserDeleteOutlined";
import WifiOutlined from "@ant-design/icons/WifiOutlined";
import { Button, List } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";
import { toJS } from "mobx";
import { Stage } from "../../../server/src/state/stage";
import { useSocketClient } from "../lib/socket";

interface IProps {
    onKickPlayer?: (name: string) => void;
}

export const PlayerList: React.FC<IProps> = ({ onKickPlayer }) => {
    const { socket } = useSocketClient();
    return (
        <Observer>
            {() => (
                <>
                    {roomStore.stage !== Stage.WAITING && (
                        <div
                            style={{
                                paddingBottom: "20px",
                                textAlign: "center",
                            }}
                        >
                            Game ID: {roomStore.room.id}
                        </div>
                    )}
                    <List
                        bordered
                        dataSource={toJS(roomStore.room).players}
                        renderItem={(player) => (
                            <List.Item
                                extra={
                                    onKickPlayer ? (
                                        <Button
                                            icon={
                                                <UserDeleteOutlined
                                                    onClick={() =>
                                                        onKickPlayer(
                                                            player.name
                                                        )
                                                    }
                                                />
                                            }
                                        />
                                    ) : undefined
                                }
                            >
                                <span>
                                    {player.connected ? (
                                        <WifiOutlined />
                                    ) : (
                                        <DisconnectOutlined />
                                    )}{" "}
                                    {player.name}
                                </span>
                            </List.Item>
                        )}
                    />
                    <Button
                        danger
                        style={{ marginTop: "20px", width: "100%" }}
                        onClick={() => socket.emit("reset")}
                    >
                        重置
                    </Button>
                </>
            )}
        </Observer>
    );
};
