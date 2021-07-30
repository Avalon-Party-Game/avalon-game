import React from "react";
import { Form, Input, Layout, Button } from "antd";
import { useHistory } from "react-router-dom";
import { userStore } from "../store/user";

export const Welcome = () => {
    const [form] = Form.useForm<{ name: string; room: string }>();
    const history = useHistory();

    const handleSubmit = React.useCallback(async () => {
        const { name: originalName, room } = await form.validateFields();
        const name = originalName.trim();
        userStore.updateUserInfo({ name, room });
        history.push(`/waiting/${window.encodeURIComponent(room)}`);
    }, [history]);

    // React.useEffect(() => {
    //     Modal.confirm({
    //         title: "Input your name",
    //         content: (
    //             <Form form={form} style={{ padding: "30px" }}>
    //                 <Form.Item name="name" label="Name">
    //                     <Input />
    //                 </Form.Item>
    //                 <Form.Item name="room" label="Room" initialValue="testRoom">
    //                     <Input />
    //                 </Form.Item>
    //             </Form>
    //         ),
    //         onOk: handleSubmit,
    //     });
    // }, []);

    return (
        <Layout>
            <Layout.Header>
                <h1>AVALON</h1>
            </Layout.Header>
            <Form form={form} style={{ padding: "30px" }}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
                <Form.Item name="room" label="Room" initialValue="testRoom" hidden>
                    <Input />
                </Form.Item>
                <Button style={{ marginTop: 30 }} onClick={handleSubmit}>
                    JOIN GAME
                </Button>
            </Form>
        </Layout>
    );
};
