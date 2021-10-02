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
// import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import SettingIcon from "@material-ui/icons/Settings";

// core components/views for Admin layout
import Dashboard from "views/Dashboard/Dashboard.jsx";
import Records from "views/Records/Records";
import Tasks from "views/Tasks/Tasks";
import SSs from "views/Setting/Setting";
import { basePath, baseRoutes } from "base-routes";

// const basePath = "/ab/asg";

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
    name: "Project Records",
    icon: DonutLargeIcon,
    component: Records,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: true
  },
  {
    path: baseRoutes.tasks.useLink,
    name: "Task Records",
    icon: ReceiptIcon,
    component: Tasks,
    layout: "/admin",
    basePath: basePath,
    showInSideBar: false
  },
  // {
  //   path: baseRoutes.profile.path,
  //   name: baseRoutes.profile.pathName,
  //   icon: PermContactCalendarIcon,
  //   component: Profile,
  //   layout: "/admin",
  //   basePath: basePath,
  //   showInSideBar: false
  // },
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
// console.log(dashboardRoutes);
// debugger ;
export default dashboardRoutes;
