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

/* 
==========================================================
* In this class Ad-Network selection and all api's related to adnetwork services are used
* Redux data setup and data fetching is also handling.
==========================================================
*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import {
  withStyles,
} from "@material-ui/core/";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import { connect } from "react-redux";
import {
  reduxLoad,
  addTimeStamp, empList
} from "../../js/actions/index";
function mapDispatchToProps(dispatch) {
  return {
    addTimeStamp: addTimeStampVal => dispatch(addTimeStamp(addTimeStampVal)),
    reduxLoad: reduxLoadVal => dispatch(reduxLoad(reduxLoadVal)),
    empList: empListVal => dispatch(empList(empListVal)),
  };
}
const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    loadingFlag: state.loadingFlag,
    timestamp: state.timestamp,
    reduxLoadFlag: state.reduxLoadFlag,
    empListArr: state.empList,
  };
};
class AdnetworkSelectFn extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    let spinner = document.getElementById('loadingSpinner');
    this.state = {
      openNotifcation: false,
      loadSpinner: false,
      spinner: spinner,
      loading: false,
      reduxLoadFlag: false,
      empListArr: this.props.empListArr,
    };
    this.fetchData = this.fetchData.bind(this)
  }
  componentDidMount() {
    this.state.spinner.setAttribute('hidden', 'true');
    this.fetchData();
  }
  async fetchData() {
    this.props.reduxLoad(true);
    const userList = [{
      "id": 1,
      "name": "test1",
      "age": "11",
      "gender": "male",
      "email": "test1@gmail.com",
      "phoneNo": "9415346313",
      createDate: new Date()
    },
    {
      "id": 2,
      "name": "test2",
      "age": "12",
      "gender": "male",
      "email": "test2@gmail.com",
      "phoneNo": "9415346314",
      createDate: new Date(),
    },
    {
      "id": 3,
      "name": "test3",
      "age": "13",
      "gender": "male",
      "email": "test3@gmail.com",
      "phoneNo": "9415346315",
      createDate: new Date(),
    },
    {
      "id": 4,
      "name": "test4",
      "age": "14",
      "gender": "male",
      "email": "test4@gmail.com",
      "phoneNo": "9415346316",
      createDate: new Date(),
    },
    {
      "id": 5,
      "name": "test5",
      "age": "15",
      "gender": "male",
      "email": "test5@gmail.com",
      "phoneNo": "9415346317",
      createDate: new Date(),
    },
    {
      "id": 6,
      "name": "test6",
      "age": "16",
      "gender": "male",
      "email": "test6@gmail.com",
      "phoneNo": "9415346318",
      createDate: new Date(),
    }]
    // add user if not exists
    const empListArr = this.state.empListArr;
    if (!empListArr || !empListArr.length) {
      this.props.empList(userList);
    }
    setTimeout(function () {
      this.props.reduxLoad(true);
    }.bind(this), 500);
  }
  render() {
    return (
      <div className="addNetworkBtnCover">
      </div>
    );
  }
}

AdnetworkSelectFn.propTypes = {
  classes: PropTypes.object
};

const AdnetworkSelect = connect(
  mapStateToProps, mapDispatchToProps
)(AdnetworkSelectFn);
export default withStyles(headerLinksStyle)(AdnetworkSelect);
