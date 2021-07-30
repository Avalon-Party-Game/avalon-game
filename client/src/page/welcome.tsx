import React from "react";
import { Form, Input, Layout, Button } from "antd";
import { useHistory } from "react-router-dom";
import { userStore } from "../store/user";

interface IFormValue {
    name: string;
    room: string;
}

export const Welcome = () => {
    const [form] = Form.useForm<IFormValue>();
    const history = useHistory();

    const handleSubmit = React.useCallback(
        async (value: IFormValue) => {
            const { name: originalName, room } = value;
            const name = originalName.trim();
            userStore.updateUserInfo({ name, room });
            history.push(`/waiting/${window.encodeURIComponent(room)}`);
        },
        [history]
    );

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Header>
                <h1>阿瓦隆</h1>
            </Layout.Header>
            <Layout.Content>
                <Form
                    form={form}
                    style={{ padding: "30px" }}
                    onFinish={handleSubmit}
                >
                    <Form.Item name="name" label="你的名字" required>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="room"
                        label="Room"
                        initialValue="testRoom"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Layout.Content>
            <Layout.Footer>
                <Button block type="primary" onClick={form.submit}>
                    加入游戏
                </Button>
            </Layout.Footer>
        </Layout>
    );
};
