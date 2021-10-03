import React, { Component, useReducer } from "react";
import { Button, FormGroup, TextField, Checkbox, FormControlLabel, Slide } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import "assets/css/login.css";
import logo from "assets/img/wLogo.png";
import { basePath, baseRoutes } from "base-routes";
import { FormErrors } from "./FormErrors";
import fetch from "isomorphic-fetch";
import { store } from "react-notifications-component";
import { userService } from "_services/user.service";
import enMsg from "__helpers/locale/en/en";
import { clientTokenHeader } from "__helpers/auth-header";
import { connect } from "react-redux";
import {
  userdata, authData,
  reduxLoad,
} from "../../js/actions/index";
import { DATA_LOADING } from "__helpers/constants";
import { USER_INFO, EMAIL_REGEX, MAX_PASSWORD_LENGTH } from "__helpers/constants";
import { accessToken } from "__helpers/utils";

function mapDispatchToProps(dispatch) {
  return {
    userdata: userdataVal => dispatch(userdata(userdataVal)),
    authData: authDataVal => dispatch(authData(authDataVal)),
    reduxLoad: reduxLoadVal => dispatch(reduxLoad(reduxLoadVal)),
  };
}
const mapStateToProps = state => {
  return {
    userdataCal: state.userdata,
    reduxLoadFlag: state.reduxLoadFlag,
  };
};
class LoginClass extends Component {
  constructor(props) {
    super(props);
    userService.logout();
    let spinner = document.getElementById('loadingSpinner');
    this.state = {
      email: "",
      username: "",
      password: "",
      formErrors: { email: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      loading: false,
      isRemember: false,
      passwordType: "password",
      reduxLoadFlag: false,
      spinner: spinner,
      userdataCal: this.props.userdataCal,
    };
    this.clientAuthToken = null;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    console.log(fieldName, value)
    switch (fieldName) {
      case "email":
        if (value.trim().length == 0) {
          emailValid = false;
          fieldValidationErrors.email = enMsg.emailRequiredMsg;
        }
        else if (!value.trim().match(EMAIL_REGEX)) {
          emailValid = false;
          fieldValidationErrors.email = enMsg.inValidUser;
        }
        else {
          emailValid = true;
          fieldValidationErrors.email = '';
        }
        break;
      case "password":
        let error = "";
        passwordValid = true;
        if (!value.trim().length) {
          passwordValid = false;
          error = enMsg.passwordRequired;
        } else if (value.length < 2) {
          passwordValid = false;
          error = enMsg.passwordSort;
        }
        fieldValidationErrors.password = error;
        break;
      default:
        emailValid = true;
        passwordValid = true;
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }
  validateForm() {
    return this.state.emailValid && this.state.passwordValid;
  }
  componentDidMount = () => {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner && !spinner.hasAttribute('hidden')) {
      spinner.setAttribute('hidden', 'true');
    }
    document.title = 'Login';
    // add username and password in redux
    if (!this.state.userdataCal || !this.state.userdataCal.userName) {
      const data = {
        userName: "hruday@gmail.com",
        name: "Admin",
        age: 25,
        phoneNo: "9876543210",
        gender: "male",
        password: btoa("hruday123")
      }
      this.props.userdata(data)
      this.setState({
        userdataCal: data,
      })
    }

  };
  async handleSubmit(event) {
    this.props.reduxLoad(false);
    this.setState({ loading: true });
    event.preventDefault();
    const data = {
      userName: this.state.email,
      password: btoa(this.state.password),
    };
    let showNotification = {};
    console.log(data, this.props.userdataCal)
    let userDetail = this.props.userdataCal;
    if (data.userName == userDetail.userName && data.password == userDetail.password) {
      let accessTokenGen = btoa(btoa(data.userName) + btoa(data.password))
      let user = {
        accessToken: accessTokenGen,
        userRole: "ADMIN",
        userName: this.state.email,
      };
      this.props.authData(user)
      showNotification = {
        title: enMsg.loginFailedTitle,
        message: "Login successfully.",
        type: "success"
      };
      window.location.replace(baseRoutes.dashboard.path);
    } else {
      showNotification = {
        title: enMsg.loginFailedTitle,
        message: "Invalid credentials, please refer read me file for login credentials.",
        type: "danger"
      };
    }
    this.setState({ loading: false });
    userService.showNotification(showNotification)
  }
  changePasswordType = e => {
    let passwordType = (this.state.passwordType == "password") ? "text" : "password";
    this.setState({
      passwordType: passwordType
    });
  }
  render() {
    return (
      <div className="login-outer-cover box Dashboard-wrapper-1">
        <div className="login-cover Dashboard-wrapper-1">
          <div className="logo-content loginLogoMain">
            <div className="loginLogoInner">
              <img height="150px" src={logo} alt="logo" />
            </div>
          </div>
          <div className="login-inner-cover">
            <div className="login-content">
              <div className="Login">
                <form onSubmit={this.handleSubmit} noValidate>
                  <FormGroup>
                    <TextField
                      label="Email Address *"
                      type="email"
                      name="email"
                      data-validators="isRequired,isAlpha"
                      onChange={event => this.handleUserInput(event)}
                      value={this.state.email}
                    />
                    <FormErrors
                      show={!this.state.emailValid}
                      formErrors={this.state.formErrors}
                      fieldName="email"
                    />
                  </FormGroup>
                  <FormGroup className="possword-input">
                    <TextField
                      label="Password *"
                      type={this.state.passwordType}
                      name="password"
                      data-validators="isRequired,isAlpha"
                      onChange={event => this.handleUserInput(event)}
                      value={this.state.password}
                      inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                    />
                    <FormErrors
                      show={!this.state.passwordValid}
                      formErrors={this.state.formErrors}
                      fieldName="password"
                    />
                  </FormGroup>
                  <div className="action-btns">
                    <Button
                      color="primary"
                      className={this.state.loading ? "buttonSuccess btn1" : "btn1"}
                      disabled={this.state.loading || !this.validateForm()}
                      type="submit"
                    >
                      Login
                      {this.state.loading && (
                        <CircularProgress
                          size={24}
                          className="buttonProgress"
                        />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export const Login = connect(
  mapStateToProps, mapDispatchToProps
)(LoginClass);
export default Login;