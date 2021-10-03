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
// @material-ui/icons
import DashboardIcons from "@material-ui/icons/Dashboard";
import ReceiptIcon from '@material-ui/icons/Receipt';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Dashboard from "views/Dashboard/Dashboard.jsx";
import Records from "views/Records/Records";
import { basePath, baseRoutes } from "base-routes";

const dashboardRoutes = [
  {
    path: baseRoutes.dashboard.useLink,
    name: "Dashboard",
    icon: DashboardIcons,
    component: Dashboard,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  {
    path: baseRoutes.records.useLink,
    name: "Employee Records",
    icon: DonutLargeIcon,
    component: Records,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  {
    path: "/",
    name: "Dashboard",
    icon: DashboardIcons,
    component: Dashboard,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: false
  }
];
export default dashboardRoutes;
