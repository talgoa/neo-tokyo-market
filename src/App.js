import "./App.css";
import Admin from "./pages/Admin.js";
import Identities from "./pages/Identities";

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import ItemCaches from "./pages/ItemCaches";
import Vaults from "./pages/Vaults";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/identities">
          <Identities />
        </Route>
        <Route path="/vaults">
          <Vaults />
        </Route>
        <Route path="/itemcaches">
          <ItemCaches />
        </Route>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
