import React from "react";
import { Switch,Route } from "react-router-dom";
import Explora from "../../pages/explora/explora";
import NewPlaylist from "../../pages/playlist/new-playlist";
import ErrorPage from "../../pages/private-configuration/error-page";
const Container = () => {
    return (
        <div className="row">
             <Switch>
                <Route exact path="/dashboard" component={Explora} />
                <Route exact path="/dashboard/playlist" component={NewPlaylist}/>
                <Route exact path="*" component={ErrorPage} />
            </Switch>
           </div>
    )
}
export default Container