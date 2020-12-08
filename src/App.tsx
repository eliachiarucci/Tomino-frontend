import React, { useState } from "react";
import "./App.less";
import { Switch, Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import HomePage from "./screens/HomePage";
import Login from "./screens/auth/Login";
import AuthService from "./services/auth-service";
import ProtectedRoute from "./components/ProtectedRoute.js";
import UserPage from "./screens/user/UserPage";
import NavBar from "./components/NavBar/NavBar";
import Signup from "./screens/auth/Signup";
import NewRecipe from "./screens/user/NewRecipe";
import { Spin } from "antd";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const service = new AuthService();

  // Function to help fetch a logged in user
  const fetchUser = () => {
    if (loggedInUser === null) {
      service
        .isAuthenticated()
        .then((response) => {
          setLoggedInUser(response);
        })
        .catch((err) => {
          setLoggedInUser(false);
        });
    }
  };

  // Function to help get the loggedIn user
  const getLoggedInUser = (userObject: object) => {
    setLoggedInUser(userObject);
  };

  // Run to check if user is authenticated
  fetchUser();

  return (
    <section className="App">
      <Router>
        <NavBar userInSession={loggedInUser} getUser={getLoggedInUser} />
        {loggedInUser !== null ? (
          <Switch>
            <ProtectedRoute user={loggedInUser} getUser={getLoggedInUser} exact path="/home" component={UserPage} />
            <ProtectedRoute
              user={loggedInUser}
              getUser={getLoggedInUser}
              exact
              path="/newrecipe"
              component={NewRecipe}
            />
            <Route path="/" exact component={HomePage} />
            <Route
              path="/login"
              exact
              render={() => (!loggedInUser ? <Login getUser={getLoggedInUser} /> : <Redirect to="/home" />)}
            />
            <Route path="/signup" exact render={() => (!loggedInUser ? <Signup /> : <Redirect to="/home" />)} />
          </Switch>
        ) : (
          <Spin></Spin>
        )}
      </Router>
    </section>
  );
}

export default App;
