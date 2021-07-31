import React from "react";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import { Routes } from "./router";
import { SocketClient, SocketClientContext } from "./lib/socket";
import "./main.css";
import "antd/dist/antd.dark.css";

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <SocketClientContext.Provider value={SocketClient.instance}>
            <Routes />
        </SocketClientContext.Provider>
    </ConfigProvider>,
    document.getElementById("root")
);
