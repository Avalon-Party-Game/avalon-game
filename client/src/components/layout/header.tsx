import { Layout, Modal, Button, Row, Col } from "antd";
import { observer } from "mobx-react";
import React from "react";
import { useSocketClient } from "../../lib/socket";
import { userStore } from "../../store/user";
import { PlayerList } from "../player-list";

export const Header: React.FC<{
    showLeave?: boolean;
    enablePlayerList?: boolean;
}> = observer(({ children, showLeave = true, enablePlayerList = false }) => {
    const [online, setOnline] = React.useState(false);
    const [showPlayerList, setShowPlayerList] = React.useState(false);
    const socketClient = useSocketClient();

    const handleSetOnline = React.useCallback(() => {
        if (userStore.userInfo && socketClient.socket.connected) {
            setOnline(true);
        } else {
            setOnline(false);
        }
    }, [socketClient]);

    React.useEffect(() => {
        handleSetOnline();
        socketClient.socket.on("connect", handleSetOnline);
        socketClient.socket.on("disconnect", handleSetOnline);
        return () => {
            socketClient.socket.off("connect", handleSetOnline);
            socketClient.socket.off("connect", handleSetOnline);
        };
    }, [handleSetOnline, socketClient]);

    const handleLeave = React.useCallback(() => {
        Modal.confirm({
            content: "确定吗？",
            onOk: () => {
                userStore.updateUserInfo(null);
                socketClient.socket.disconnect();
            },
        });
    }, [socketClient]);

    return (
        <>
            <Layout.Header
                style={{ padding: "0 20px", background: "rgba(0,0,0,0.5)" }}
            >
                <Row style={{ width: "100%" }}>
                    <Col
                        span={6}
                        style={{ textAlign: "left" }}
                        onClick={
                            enablePlayerList
                                ? () => setShowPlayerList(true)
                                : undefined
                        }
                    >
                        状态：{online ? "在线" : "离线"}
                    </Col>
                    <Col span={12} style={{ textAlign: "center" }}>
                        {children}
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        {showLeave && (
                            <Button ghost size="small" onClick={handleLeave}>
                                退出
                            </Button>
                        )}
                    </Col>
                </Row>
            </Layout.Header>
            <Modal
                visible={showPlayerList}
                title="玩家列表"
                footer={null}
                onCancel={() => setShowPlayerList(false)}
            >
                <PlayerList />
            </Modal>
        </>
    );
});
