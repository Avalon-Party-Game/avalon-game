import React from "react";
import { Modal, Form, Select, message } from "antd";
import { observer } from "mobx-react";
import { roomStore } from "../store/room";
import { useSocketClient } from "../lib/socket";

interface IProps {
    visible: boolean;
    onClose: () => void;
}

export const StartNewElection = observer((props: IProps) => {
    const [form] = Form.useForm<{ players: string[] }>();
    const socketClinet = useSocketClient();

    const handleSubmit = React.useCallback(async () => {
        const { players } = await form.validateFields();
        if (players.length) {
            socketClinet.socket.emit("startNewElection", players);
            props.onClose();
            form.resetFields(["players"]);
        } else {
            message.error("选择为空");
        }
    }, [form, props, socketClinet.socket]);

    return (
        <Modal
            title="选择执行任务的人"
            visible={props.visible}
            onCancel={props.onClose}
            onOk={handleSubmit}
        >
            <Form form={form}>
                <Form.Item name="players">
                    <Select mode="multiple">
                        {roomStore.room.players.map((player) => (
                            <Select.Option
                                key={player.name}
                                value={player.name}
                            >
                                {player.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
});
