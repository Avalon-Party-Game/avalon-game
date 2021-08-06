// import merlin from "../../../assets/merlin.jpg";
// import percival from "../../../assets/percival.jpg";
// import modred from "../../../assets/modred.jpeg";

import React from "react";
import { Layout } from "antd";

const imgArr = ["/images/bg.jpg", "/images/avalon.jpg"];

export const GameLayout: React.FC = ({ children }) => {
    const pic = React.useMemo(
        () => imgArr[Math.floor(Math.random() * imgArr.length)],
        []
    );
    return (
        <Layout
            style={{
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.75)",
                backgroundImage: `url(${pic})`,
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "darken",
            }}
        >
            {children}
        </Layout>
    );
};
