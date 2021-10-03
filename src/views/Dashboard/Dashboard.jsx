import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import clock from "assets/img/clock.png";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { connect } from "react-redux";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ReactComponent as ProjectsIcon } from "assets/img/people.svg"
import { ReactComponent as TasksIcon } from "assets/img/vendor.svg"
import { } from 'js/actions';
import { uid } from "__helpers/utils";
import { userService } from "_services/user.service";

function mapDispatchToProps(dispatch) {
  return {
  };
}
const mapStateToProps = state => {
  return {
    reduxLoadFlag: state.reduxLoadFlag,
    empListArr: state.empList,
    userdataCal: state.userdata,
  };
};

class DashboardClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empListArr: this.props.empListArr ? this.props.empListArr : [],
      userdataCal: this.props.userdataCal ? this.props.userdataCal : {},
      priorityChartOptions: {},
      statusChartOptions: {},
    };
    this.getTaskPriorityChart = this.getTaskPriorityChart.bind(this);
    this.getTaskStatusChart = this.getTaskStatusChart.bind(this);
  }
  async componentDidMount() {
    this.getTaskPriorityChart();
    this.getTaskStatusChart();
  }
  componentDidUpdate() {
    if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
      let empListArr = this.props.empListArr && this.props.empListArr.length ? this.props.empListArr : [];
      this.setState({
        taskListArr: empListArr,
        reduxLoadFlag: this.props.reduxLoadFlag,
      }, () => { this.getTaskPriorityChart(); this.getTaskStatusChart(); })
    }
  }
  getTaskPriorityChart() {
    let empListArr = this.state.empListArr;
    const pieChartData = [];
    let male = 0;
    let female = 0;
    let other = 0;
    if (empListArr && empListArr.length) {
      empListArr.map((tList) => {
        if (tList.gender == "male") {
          male++;
        } else if (tList.gender == "female") {
          female++;
        } else {
          other++;
        }
      })
      pieChartData.push({ name: "Male", y: male * 100 / empListArr.length, count: male });
      pieChartData.push({ name: "Female", y: female * 100 / empListArr.length, count: female });
      pieChartData.push({ name: "Other", y: other * 100 / empListArr.length, count: other });

    } let priorityChartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Employee Gender Chart'
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
            <div>
              <b>${this.key}</b>
              <p>
                <ul style="color:${this.color}; list-style-type:upper-roman;">
                  <li style="font-size: 14px;margin-left: 15px;list-style-type: circle;">
                    <span style="color: black">Employees: <b>${this.point.count}</b><span>
                  </li>
                </ul>
              </p>
            </div>`;
        }
      },
      colors: ['#32b462', '#b7cf1f', '#c2303f'],
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Employees',
        colorByPoint: true,
        data: pieChartData,
      }]
      // series: pieChartData,
    };
    this.setState({ priorityChartOptions: priorityChartOptions, })
  }
  getTaskStatusChart() {
    let empListArr = this.state.taskListArr;
    const pieChartData = [];
    let upto10 = 0;
    let upto20 = 0;
    let upto30 = 0;
    let upto40 = 0;
    let upto50 = 0;
    let upto60 = 0;
    let upto70 = 0;
    let above70 = 0;
    if (empListArr && empListArr.length) {
      empListArr.map((tList) => {
        if (Number(tList.age) <= 10) {
          upto10++;
        } else if (Number(tList.age) <= 20) {
          upto20++;
        } else if (Number(tList.age) <= 30) {
          upto30++;
        } else if (Number(tList.age) <= 40) {
          upto40++;
        } else if (Number(tList.age) <= 50) {
          upto50++;
        } else if (Number(tList.age) <= 60) {
          upto60++;
        } else if (Number(tList.age) <= 70) {
          upto70++;
        } else {
          above70++;
        }
      })
      pieChartData.push({ name: "0 - 10", y: upto10 * 100 / empListArr.length, count:upto10 });
      pieChartData.push({ name: "10 - 20", y: upto20 * 100 / empListArr.length, count:upto20 });
      pieChartData.push({ name: "20 - 30", y: upto30 * 100 / empListArr.length, count:upto30 });
      pieChartData.push({ name: "30 - 40", y: upto40 * 100 / empListArr.length, count:upto40 });
      pieChartData.push({ name: "40 - 50", y: upto50 * 100 / empListArr.length, count:upto50 });
      pieChartData.push({ name: "50 - 60", y: upto60 * 100 / empListArr.length, count:upto60 });
      pieChartData.push({ name: "60 - 70", y: upto70 * 100 / empListArr.length, count:upto70 });
      pieChartData.push({ name: "70 - 120", y: above70 * 100 / empListArr.length, count:above70 });
    }
    let statusChartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Age Group Chart'
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
            <div>
              <b>${this.key}</b>
              <p>
                <ul style="color:${this.color}; list-style-type:upper-roman;">
                  <li style="font-size: 14px;margin-left: 15px;list-style-type: circle;">
                    <span style="color: black">Age: <b>${this.point.count}</b><span>
                  </li>
                </ul>
              </p>
            </div>`;
        }
      },
      colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Age',
        colorByPoint: true,
        data: pieChartData,
      }]
      // series: pieChartData,
    };
    this.setState({ statusChartOptions: statusChartOptions, })
  }
  getMaleEmp() {
    const empListArr = this.state.empListArr;
    let count = 0;
    empListArr && empListArr.length && empListArr.map((eList) => {
      if (eList.gender == "male") {
        count++;
      }
    })
    return <p>{count ? count : "No"} employees</p>
  }
  getFemailEmp() {
    const empListArr = this.state.empListArr;
    let count = 0;
    empListArr && empListArr.length && empListArr.map((eList) => {
      if (eList.gender == "female") {
        count++;
      }
    })
    return <p>{count ? count : "No"} employees</p>
  }
  render() {
    const { classes } = this.props;
    const {
      priorityChartOptions, statusChartOptions,
      empListArr, userdataCal
    } = this.state;
    const test1 = "test-cover1";
    const clock_cover = "clock-cover";
    const styletest = { padding: "23px" };
    const styletest1 = { padding: "21px 24px" };
    const clock_style = {
      width: "15px",
      height: "15px",
      position: "relative",
      top: "3px",
      marginRight: "3px"
    };
    return (
      <div>
        {/* <NotificationContainer/> */}
        <GridContainer>
          <GridItem xs={12} sm={6}>
            <Card className={"dash-tiles box temp_card_color box_card"}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="success" className={test1 + " new-cover"} style={styletest1}>
                  <TasksIcon className="card_img" fill='white' stroke='transparent' />
                </CardIcon>
                <p className={classes.cardCategory + " white-text current-air"}>My Profile</p>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>Name</p> {userdataCal && userdataCal.name ? userdataCal.name : "Admin"}</span>
                  <span className="tempratures"><p>Email</p> {userdataCal && userdataCal.userName ? userdataCal.userName : "N/A"}</span>
                  <span className="tempratures"><p>PhoneNo</p> {userdataCal && userdataCal.phoneNo ? userdataCal.phoneNo : "N/A"}</span>
                </span>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>Gender</p> {userdataCal && userdataCal.gender ? userdataCal.gender : "N/A"}</span>
                  <span className="tempratures"><p>Age</p> {userdataCal && userdataCal.age ? userdataCal.age + " years" : "N/A"}</span>
                </span>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <img
                    src={clock}
                    className={clock_cover}
                    style={clock_style}
                    alt="time"
                  />
                  <span className="white-text">{"Just now"}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Card className={`dash-tiles box light_green_color`}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success" className={"box-image-cover new-cover"} style={styletest}>
                  <ProjectsIcon className="card_img" fill='white' stroke='transparent' />
                </CardIcon>
                <p className={classes.cardCategory + " white-text current-air"}>Users</p>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>Total Employees</p> {empListArr && empListArr.length ? empListArr.length : "No employees"}</span>
                </span>
                <span className="full-width d-flex">
                  <span className="tempratures"><p>Male</p> {this.getMaleEmp()}</span>
                  <span className="tempratures"><p>Female</p> {this.getFemailEmp()}</span>
                </span>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats + " white-text"}>
                  <img
                    src={clock}
                    className={clock_cover + " white-text"}
                    style={clock_style}
                    alt="time"
                  />
                  <span className="white-text">{"Just now"}</span>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>

        <span className="box-with-bg">
          <GridContainer>
            <GridItem xs={12} sm={6}>
              <HighchartsReact
                highcharts={Highcharts}
                options={priorityChartOptions}
                className="chart-css"
                style={{ width: "100%", height: "500px" }}
                containerProps={{ style: { height: "500px" } }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <HighchartsReact
                highcharts={Highcharts}
                options={statusChartOptions}
                className="chart-css"
                style={{ width: "100%", height: "500px" }}
                containerProps={{ style: { height: "500px" } }}
              />
            </GridItem>
          </GridContainer>
        </span>
      </div>
    );
  }
}

DashboardClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Dashboard = connect(
  mapStateToProps, mapDispatchToProps
)(DashboardClass);

// export default Form;
export default withStyles(dashboardStyle)(Dashboard);