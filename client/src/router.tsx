import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { InGame } from "./page/ingame";
import { WaitingRoom } from "./page/waiting";
import { Welcome } from "./page/welcome";
import { autorun } from "mobx";
import { roomStore } from "./store/room";
import { userStore } from "./store/user";
import { Stage } from "../../server/src/statemachine/stage";

export const history = createBrowserHistory();

const RouteGuard: React.FC = ({ children }) => {
    React.useEffect(
        () =>
            autorun(() => {
                if (userStore.userInfo?.name && userStore.userInfo.room) {
                    if (roomStore.stage === Stage.WAITING) {
                        history.push(`/waiting/${userStore.userInfo.room}`);
                    } else {
                        history.push("/in-game");
                    }
                } else {
                    history.push("/");
                }
            }),
        []
    );
    return <>{children}</>;
};

export const Routes = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/">
                    <RouteGuard>
                        <Welcome />
                    </RouteGuard>
                </Route>
                <Route exact path="/waiting/:room">
                    <RouteGuard>
                        <WaitingRoom />
                    </RouteGuard>
                </Route>
                <Route exact path="/in-game">
                    <RouteGuard>
                        <InGame />
                    </RouteGuard>
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};
