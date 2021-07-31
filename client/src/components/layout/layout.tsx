import React from "react";
import { Layout } from "antd";
import bg from "../../../assets/bg.jpg";

export const GameLayout: React.FC = ({ children }) => {
    return (
        <Layout
            style={{
                height: "100vh",
                background: `rgba(0,0,0,0.8) url(${bg})`,
                backgroundBlendMode: "darken",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            {children}
        </Layout>
    );
};
