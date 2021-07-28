import { Input, Modal, Form } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";

export const Welcome = () => {
    const [form] = Form.useForm<{ name: string; room: string }>();
    const history = useHistory();

    React.useEffect(() => {
        Modal.confirm({
            title: "Input your name",
            content: (
                <Form form={form}>
                    <Form.Item name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="room">
                        <Input />
                    </Form.Item>
                </Form>
            ),
            onOk: async () => {
                const { name: originalName, room } =
                    await form.validateFields();
                const name = originalName.trim();
                history.push(
                    `/waiting/${window.encodeURIComponent(
                        room
                    )}/${window.encodeURIComponent(name)}`
                );
            },
        });
    }, []);

    return <div>AVALON</div>;
};
