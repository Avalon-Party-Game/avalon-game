import bg from "../../../assets/bg.jpg";
// import merlin from "../../../assets/merlin.jpg";
// import percival from "../../../assets/percival.jpg";
// import modred from "../../../assets/modred.jpeg";
import avalon from "../../../assets/avalon.jpg";
import React from "react";
import { Layout } from "antd";

const imgArr = [bg, avalon];

export const GameLayout: React.FC = ({ children }) => {
    const pic = imgArr[Math.floor(Math.random() * imgArr.length)];
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
