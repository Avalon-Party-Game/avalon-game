import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { WaitingRoom } from "./waiting";
import { Welcome } from "./welcome";

export const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route
                    exact
                    path="/waiting/:room/:name"
                    component={WaitingRoom}
                />
            </Switch>
        </BrowserRouter>
    );
};
