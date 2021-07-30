import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { InGame } from "./page/ingame";
import { WaitingRoom } from "./page/waiting";
import { Welcome } from "./page/welcome";

export const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/waiting/:room" component={WaitingRoom} />
                <Route exact path="/in-game" component={InGame} />
            </Switch>
        </BrowserRouter>
    );
};
