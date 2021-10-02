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
import { ReactComponent as ProjectsIcon } from "assets/img/assets.svg"
import { ReactComponent as TasksIcon } from "assets/img/advert.svg"
import { taskList, reduxLoad, projectList } from 'js/actions';
import { uid } from "__helpers/utils";
import { userService } from "_services/user.service";

function mapDispatchToProps(dispatch) {
  return {
    projectList: projects => dispatch(projectList(projects)),
    taskList: projects => dispatch(taskList(projects))
  };
}
const mapStateToProps = state => {
  return {
    reduxLoadFlag: state.reduxLoadFlag,
    taskListArr: state.taskList,
    projectListArr: state.projectList,
  };
};

class DashboardClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectListArr: this.props.projectListArr ? this.props.projectListArr : [],
      taskListArr: this.props.taskListArr ? this.props.taskListArr : [],
      priorityChartOptions: {},
      statusChartOptions: {},
    };
    this.getTaskPriorityChart = this.getTaskPriorityChart.bind(this);
    this.getTaskStatusChart = this.getTaskStatusChart.bind(this);
  }
  async componentDidMount() {
    // create dummy tasks and projects
    if (!this.state.projectListArr || !this.state.projectListArr.length) {
      const projectId = uid();
      const data = [{
        uid: projectId,
        projectName: "Health Care Project",
        projectDesc: "Health care project to manage patients",
        createDate: new Date(),
      }]
      this.props.projectList(data);
      const dataArr = [{
        uid: uid(),
        projectId: projectId,
        taskName: "Design Wireframs",
        taskDescription: "Design wireframs and approve from clients",
        taskPriority: "medium",
        taskStatus: "new",
        createDate: new Date(),
      }, {
        uid: uid(),
        projectId: projectId,
        taskName: "Design Database",
        taskDescription: "Design database schema with team",
        taskPriority: "low",
        taskStatus: "process",
        createDate: new Date(),
      }, {
        uid: uid(),
        projectId: projectId,
        taskName: "Sprint Plan",
        taskDescription: "Manage board and create tasks",
        taskPriority: "high",
        taskStatus: "new",
        createDate: new Date(),
      },
      ]
      this.props.taskList(dataArr);
      this.setState({
        projectListArr: data,
        taskListArr: dataArr,
      }, () => { this.getTaskPriorityChart(); this.getTaskStatusChart(); })
    }else{
      this.getTaskPriorityChart();
      this.getTaskStatusChart();
    }
  }
  getTaskPriorityChart() {
    let originalTaskListArr = this.state.taskListArr;
    const pieChartData = [];
    let lowTasks = 0;
    let mediumTasks = 0;
    let highTasks = 0;
    originalTaskListArr.map((tList) => {
      if (tList.taskPriority == "low") {
        lowTasks++;
      } else if (tList.taskPriority == "medium") {
        mediumTasks++;
      } else {
        highTasks++;
      }
    })
    pieChartData.push({ name: "Low", y: lowTasks * 100 / originalTaskListArr.length });
    pieChartData.push({ name: "Medium", y: mediumTasks * 100 / originalTaskListArr.length });
    pieChartData.push({ name: "High", y: highTasks * 100 / originalTaskListArr.length });
    let priorityChartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Tasks Priorities Chart'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
        name: 'Tasks',
        colorByPoint: true,
        data: pieChartData,
      }]
      // series: pieChartData,
    };
    this.setState({ priorityChartOptions: priorityChartOptions, })
  }
  getTaskStatusChart() {
    let originalTaskListArr = this.state.taskListArr;
    const pieChartData = [];
    let newTasks = 0;
    let progressTasks = 0;
    let doneTasks = 0;
    originalTaskListArr.map((tList) => {
      if (tList.taskStatus == "new") {
        newTasks++;
      } else if (tList.taskStatus == "progress") {
        progressTasks++;
      } else {
        doneTasks++;
      }
    })
    pieChartData.push({ name: "New", y: newTasks * 100 / originalTaskListArr.length });
    pieChartData.push({ name: "In Progress", y: progressTasks * 100 / originalTaskListArr.length });
    pieChartData.push({ name: "Done", y: doneTasks * 100 / originalTaskListArr.length });
    let statusChartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Tasks Status Chart'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
        name: 'Tasks',
        colorByPoint: true,
        data: pieChartData,
      }]
      // series: pieChartData,
    };
    this.setState({ statusChartOptions: statusChartOptions, })
  }
  render() {
    const { classes } = this.props;
    const {
      priorityChartOptions, statusChartOptions,
      projectListArr, taskListArr
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
            <Card className={`dash-tiles box light_green_color`}>
              <CardHeader color="success" stats icon>
                <CardIcon color="success" className={"box-image-cover new-cover"} style={styletest}>
                  <ProjectsIcon className="card_img" fill='white' stroke='transparent' />
                </CardIcon>
                <p className={classes.cardCategory + " white-text current-air"}>My Projects</p>
                <h3 className={classes.cardTitle + " white-text air-quality"}>{projectListArr && projectListArr.length ? projectListArr.length : "No project"}</h3>
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
          <GridItem xs={12} sm={6}>
            <Card className={"dash-tiles box temp_card_color box_card"}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="success" className={test1 + " new-cover"} style={styletest1}>
                  <TasksIcon className="card_img" fill='white' stroke='transparent' />
                </CardIcon>
                <p className={classes.cardCategory + " white-text current-air"}>My Tasks</p>
                <h3 className={classes.cardTitle}>{taskListArr && taskListArr.length ? taskListArr.length : "No tasks"}</h3>
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