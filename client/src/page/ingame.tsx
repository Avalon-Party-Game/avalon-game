import React from "react";
import { Button, Layout } from "antd";
import { Observer } from "mobx-react";
import { roomStore } from "../store/room";

export const InGame = () => {
    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Header>
                <h1>In Game</h1>
            </Layout.Header>
            <Layout.Content>
                <Observer>{() => <div>{roomStore.stage}</div>}</Observer>
            </Layout.Content>
            <Layout.Footer>
                <Button type="primary" style={{ width: "100%" }}>
                    End
                </Button>
            </Layout.Footer>
        </Layout>
    );
};
