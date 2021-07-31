import DisconnectOutlined from "@ant-design/icons/DisconnectOutlined";
import React from "react";
import UserDeleteOutlined from "@ant-design/icons/UserDeleteOutlined";
import WifiOutlined from "@ant-design/icons/WifiOutlined";
import { Button, List } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";
import { toJS } from "mobx";

interface IProps {
    onKickPlayer?: (name: string) => void;
}

export const PlayerList: React.FC<IProps> = ({ onKickPlayer }) => {
    return (
        <Observer>
            {() => (
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
                                                    onKickPlayer(player.name)
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
            )}
        </Observer>
    );
};
