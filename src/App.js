import "./App.css";
import Admin from "./pages/Admin.js";
import Identities from "./pages/Identities";

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/">
          <Identities />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
