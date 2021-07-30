import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./router";
import { SocketClient, SocketClientContext } from "./lib/socket";
import "antd/dist/antd.dark.css";

ReactDOM.render(
    <React.StrictMode>
        <SocketClientContext.Provider value={SocketClient.instance}>
            <Routes />
        </SocketClientContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
