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
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import Poppers from "@material-ui/core/Popper";
import {
  Icon,
  styles,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  ClickAwayListener,
  Hidden,
  Divider,
  withStyles,
  Avatar,
  Select,
  FormGroup,
  InputLabel,
  FormControl,
  Input,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Slide,
  IconButton,
  LinearProgress,
  ListItemText,
  ListItemAvatar,
  Typography,
  List,
  ListItem,
  Box,
} from "@material-ui/core/";
import CloseIcon from '@material-ui/icons/Close'
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import SelectAllTwoTone from "@material-ui/icons/SelectAllTwoTone";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import dummy from "assets/img/dummy.png";
import { sizeHeight } from "@material-ui/system";
import { Link } from "react-router-dom";
import { baseRoutes, basePath } from "base-routes";
import { layout } from "admin-routes";
import { userService } from "_services/user.service";
import { DEFAULT_PROFILE_IMG, NO_USERNAME } from "__helpers/constants";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer.jsx";
import dropdown from "assets/img/dropdown.png";
import AdnetworkSelect from "components/Sidebar/AdnetworkSelect";
import { connect } from "react-redux";
import logo from "assets/img/asglogo.png";
import { clientTokenHeader } from "__helpers/auth-header"
import userImg from "assets/img/user_img.png"

const mapStateToProps = state => {
  return {
  };
};
class AdminNavbarLinksClass extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    let spinner = document.getElementById('loadingSpinner');
    this.state = {
      loadSpinner: false,
      spinner: spinner,
      loading: false,
      reduxLoadFlag: false,
    };
  }

  render() {
    const { classes } = this.props;
    const styleuser = {
      borderRadius: "50%",
      width: "35px",
      height: "35px"
    };
    const userNameStyle = {
      float: "right",
      display: "block",
      width: "calc(100% - 50px)",
      color: "#000",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "normal",
      marginTop: "10px"
    };
    return (
      <div className="mobileMenuSidebar">
        
      </div>
    );
  }
}

AdminNavbarLinksClass.propTypes = {
  classes: PropTypes.object,
  updateUserInfo: PropTypes.func,
};
const AdminNavbarLinks = connect(
  mapStateToProps
)(AdminNavbarLinksClass);
export default withStyles(headerLinksStyle)(AdminNavbarLinks);
