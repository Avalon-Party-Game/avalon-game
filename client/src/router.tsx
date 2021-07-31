import React from "react";
import { autorun } from "mobx";
import { createBrowserHistory } from "history";
import { InGame } from "./page/ingame";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { roomStore } from "./store/room";
import { Stage } from "../../server/src/state/stage";
import { userStore } from "./store/user";
import { WaitingRoom } from "./page/waiting";
import { Welcome } from "./page/welcome";

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
