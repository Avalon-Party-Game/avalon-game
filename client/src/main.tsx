import "antd/dist/antd.dark.css";
import React from "react";
import ReactDOM from "react-dom";
import { SocketClient, SocketClientContext } from "./lib/socket";
import { Routes } from "./router";

ReactDOM.render(
    <React.StrictMode>
        <SocketClientContext.Provider value={SocketClient.instance}>
            <Routes />
        </SocketClientContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
