/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {
  /* BrowserRouter as */ Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
// core components
import Admin from "layouts/Admin.jsx";
import Login from "components/Login/Login.jsx";
import "assets/css/material-dashboard-react.css?v=1.7.0";
import baseRoutes from "base-routes";
import Page404 from "components/Login/Page404";
import { PrivateRoute } from "components/PrivateRoute";
import DashboardPage from "views/Dashboard/Dashboard";
import "react-notifications-component/dist/theme.css";
import { NotificationContainer } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import { Provider } from "react-redux";
import store from "./js/store/index";

const Notification = () => {
  return (
    <Provider store={store}>
      <div>
        <NotificationContainer />
        <Router history={hist}>
          <Switch>
            <PrivateRoute path={baseRoutes.dashboard.path} component={Admin} />
            <Route path={baseRoutes.login.path} component={Login} />
            <PrivateRoute path={baseRoutes.admin.path} component={Admin} />
            <Redirect from="/" to={baseRoutes.dashboard.path} unusedData={"unusedData"} />
            <Route component={Page404} />
          </Switch>
        </Router>
        <React.Fragment key={new Date().getTime()}>
        </React.Fragment>
      </div>
    </Provider>
  );
};
const hist = createBrowserHistory();
ReactDOM.render(<Notification />, document.getElementById("root"));
