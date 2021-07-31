import React from "react";
import { Form, Input, Layout, Button, Typography } from "antd";
import { useHistory } from "react-router-dom";
import { userStore } from "../store/user";
import { Header } from "../components/layout/header";
import { GameLayout } from "../components/layout/layout";
import { Footer } from "../components/layout/footer";

const { Title } = Typography;

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
        <GameLayout>
            <Header showLeave={false}>
                <div>阿瓦隆</div>
            </Header>
            <Layout.Content style={{ position: "relative" }}>
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
                <section
                    style={{
                        position: "absolute",
                        width: "100%",
                        textAlign: "center",
                        overflow: "hidden",
                        left: 0,
                        top: "calc(50% - 30px)",
                    }}
                >
                    <Title
                        style={{
                            fontWeight: 100,
                            color: "#b9b9b9",
                            letterSpacing: "20px",
                            marginRight: "-20px",
                            transform: "scaleY(0.8)",
                        }}
                    >
                        AVALON
                    </Title>
                </section>
            </Layout.Content>
            <Footer>
                <Button
                    block
                    ghost
                    size="large"
                    type="primary"
                    onClick={form.submit}
                >
                    加入游戏
                </Button>
            </Footer>
        </GameLayout>
    );
};
