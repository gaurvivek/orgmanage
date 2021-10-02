import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import enMsg from "__helpers/locale/en/en";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Link as MaterialLink,
    CircularProgress,
    FormGroup,
    FormControl, TextField, MenuItem
} from "@material-ui/core";
import GridItem from "components/Grid/GridItem.jsx";
import CardBody from "components/Card/CardBody.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { userService } from "_services/user.service";
import {
} from "__helpers/constants";
import { connect } from "react-redux";
import moment from "moment";
import {
    PER_PAGE_OPTIONS,
    RECORD_PER_PAGE,
} from "__helpers/constants";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { FormErrors } from "components/Login/FormErrors"
import DateFnsUtils from "@date-io/date-fns";
import AddTasks from "./TasksPopup";
import { basePath, baseRoutes } from "base-routes";
import Icon from '@material-ui/core/Icon';
import { taskList, reduxLoad } from 'js/actions';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

am4core.useTheme(am4themes_animated);
const columns = [
    { id: "taskName", label: "Task Name" },
    { id: "taskDescription", label: "Task Description" },
    { id: "taskPriority", label: "Task Priority" },
    { id: "taskStatus", label: "Task Status" },
    { id: "createDate", label: "Created Date" },
    { id: "", label: "Action" },
];
const ref = React.createRef();
function mapDispatchToProps(dispatch) {
    return {
        // addArticle: article => dispatch(addArticle(article))
        taskList: projects => dispatch(taskList(projects))
    };
}
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        timestamp: state.timestamp,
        campaings: state.campaings,
        reduxLoadFlag: state.reduxLoadFlag,
        taskListArr: state.taskList,
        projectListArr: state.projectList,
    };
};
class TasksClass extends React.Component {
    constructor(props) {
        super(props);
        this.dateUtility = new DateFnsUtils();
        this._isMounted = false;
        const sortedTasks = this.props.taskListArr ? this.props.taskListArr.sort((a, b) => a.taskStatus > b.taskStatus ? 1 : -1) : [];
        this.state = {
            value: 0,
            page: 0,
            loading: false,
            rowsPerPageT: RECORD_PER_PAGE,
            rowsPerPage: RECORD_PER_PAGE,
            reduxLoadFlag: false,
            openProjects: false,
            taskListArr: sortedTasks,
            originalTaskListArr: [],
            projectTaskList: [],
            projectList: this.props.projectListArr ? this.props.projectListArr : [],
            projectId: "",
            projectInfo: {},
            taskId: "",
            search: "",
            taskStatus: "All",
            priorityChartOptions: {},
            statusChartOptions: {},
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.confirmModalClose = this.confirmModalClose.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.getTaskPriorityChart = this.getTaskPriorityChart.bind(this);
        this.getTaskStatusChart = this.getTaskStatusChart.bind(this);
    }

    componentDidMount() {
        document.title = 'Tasks';
        const projectList = this.state.projectList;
        const taskListArr = this.state.taskListArr;
        if (this.props.location.state && projectList && projectList.length) {
            console.log("location... ", this.props.location.state);
            const projectInfo = projectList.filter((pList) => {
                if (pList.uid == this.props.location.state) {
                    return pList;
                }
            })
            const projectTasks = taskListArr.filter((tList) => {
                if (tList.projectId == this.props.location.state) {
                    return tList;
                }
            })
            this.setState({
                projectId: this.props.location.state,
                projectTaskList: projectTasks,
                originalTaskListArr: projectTasks,
                projectInfo: projectInfo && projectInfo.length ? projectInfo[0] : {},
            }, () => { this.getTaskPriorityChart(); this.getTaskStatusChart();})
        } else {
            const showNotification = {
                title: 'Invalid Project',
                message: 'Project not found.',
                type: "danger",
            }
            userService.showNotification(showNotification);
            setTimeout(function () {
                window.location.replace(basePath + baseRoutes.records.path);
            }, 2000);
        }
    }
    getTaskPriorityChart() {
        let originalTaskListArr = this.state.originalTaskListArr;
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
        let originalTaskListArr = this.state.originalTaskListArr;
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
    getProjectTasks() {
        const projectId = this.state.projectId;
        const taskListArr = this.state.taskListArr;
        const projectTasks = taskListArr.filter((tList) => {
            if (tList.projectId == projectId) {
                return tList;
            }
        })
        this.setState({
            projectTaskList: projectTasks,
            originalTaskListArr: projectTasks,
        }, () => { this.getTaskPriorityChart(); this.getTaskStatusChart(); })
    }
    componentDidUpdate(oldProps) {
        if (this.props.reduxLoadFlag != undefined && this.state.reduxLoadFlag != this.props.reduxLoadFlag) {
            let taskListArr = this.props.taskListArr ? this.props.taskListArr.sort((a, b) => a.taskStatus > b.taskStatus ? 1 : -1) : [];
            this.setState({
                taskListArr: taskListArr,
                reduxLoadFlag: this.props.reduxLoadFlag,
            }, () => this.getProjectTasks())
        }
    }
    handleChangePage = async (event, newPage) => {
        this.setState({
            page: newPage
        });
        // setPage(newPage);
    };
    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0
        });
    }
    validateField = (fieldName, fieldValue) => {
        let fieldValidationErrors = this.state.formErrors;
        let startDateValid = this.state.startDateValid;
        let endDateValid = this.state.endDateValid;

        switch (fieldName) {
            case "startDate":
                startDateValid = (fieldValue && fieldValue != "") ? true : false;
                fieldValidationErrors.startDate = !startDateValid
                    ? enMsg.startDateRequiredMsg
                    : "";
                break;
            case "endDate":
                endDateValid = (fieldValue && fieldValue != "") ? true : false;
                fieldValidationErrors.endDate = !endDateValid
                    ? enMsg.endDateRequiredMsg
                    : "";
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            startDateValid: startDateValid,
            endDateValid: endDateValid,
        }, this.validateForm);
    }
    validateForm() {
        return (
            this.state.startDateValid &&
            this.state.endDateValid
        )
    }
    openProjects() {
        this.setState({ openProjects: true })
    }
    confirmModalClose() {
        this.setState({
            taskId: "",
            openProjects: false,
            taskListArr: this.props.taskListArr ? this.props.taskListArr.sort((a, b) => a.taskStatus > b.taskStatus ? 1 : -1) : [],
        }, () => this.getProjectTasks())
    }
    editTask(taskId) {
        this.setState({
            taskId: taskId,
            openProjects: true,
        })
    }
    deleteTask(taskId) {
        const taskListArr = this.state.taskListArr;
        const projectTaskList = this.state.projectTaskList;
        const updatedTaskList = taskListArr.filter((tList) => {
            return tList.uid == taskId ? null : tList;
        })
        this.props.taskList(updatedTaskList);
        const updatedPTaskList = projectTaskList.filter((tList) => {
            return tList.uid == taskId ? null : tList;
        })
        this.setState({
            originalTaskListArr: projectTaskList,
            projectTaskList: updatedPTaskList,
            taskListArr: updatedTaskList,
        }, () => { this.getTaskPriorityChart(); this.getTaskStatusChart(); })
    }
    handleInput(e) {
        const { value } = e.target;
        this.setState({
            search: value,
        })
    }
    filterTasks() {
        const taskListArr = this.state.originalTaskListArr;
        const searchRes = this.state.search;
        const taskStatus = this.state.taskStatus;
        if (!searchRes) {
            if (taskStatus == "all") {
                this.setState({
                    projectTaskList: taskListArr,
                })
            } else {
                const updatedFTasks = taskListArr.filter((pList) => {
                    if (pList.taskStatus == taskStatus) {
                        return pList;
                    }
                })
                this.setState({
                    projectTaskList: updatedFTasks,
                })
            }
        } else {
            if (taskStatus == "all") {
                const updatedTasks = taskListArr.filter((pList) => {
                    if (pList.taskName.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskDescription.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskPriority.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskStatus.toLowerCase().includes(searchRes.toLowerCase())) {
                        return pList;
                    }
                })
                this.setState({
                    projectTaskList: updatedTasks
                })
            } else {
                const updatedFTasks = taskListArr.filter((pList) => {
                    if (pList.taskStatus == taskStatus) {
                        return pList;
                    }
                })
                const updatedTasks = updatedFTasks.filter((pList) => {
                    if (pList.taskName.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskDescription.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskPriority.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskStatus.toLowerCase().includes(searchRes.toLowerCase())) {
                        return pList;
                    }
                })
                this.setState({
                    projectTaskList: updatedTasks,
                })
            }
        }
    }
    handleTaskChange(value) {
        const originAaskListArr = this.state.originalTaskListArr;
        const taskListArr = this.state.projectTaskList;
        const searchRes = this.state.search;
        this.setState({
            taskStatus: value,
        })
        if (searchRes) {
            const updatedTasks = originAaskListArr.filter((pList) => {
                if (pList.taskName.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskDescription.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskPriority.toLowerCase().includes(searchRes.toLowerCase()) || pList.taskStatus.toLowerCase().includes(searchRes.toLowerCase())) {
                    return pList;
                }
            })
            if (value == "all") {
                this.setState({
                    projectTaskList: updatedTasks.sort((a, b) => a.taskStatus > b.taskStatus ? 1 : -1),
                })
            } else {
                const updatedFTasks = updatedTasks.filter((pList) => {
                    if (pList.taskStatus == value) {
                        return pList;
                    }
                })
                this.setState({
                    projectTaskList: updatedFTasks,
                })
            }
        } else {
            if (value == "all") {
                this.setState({
                    projectTaskList: originAaskListArr.sort((a, b) => a.taskStatus > b.taskStatus ? 1 : -1),
                })
            } else {
                const updatedTasks = originAaskListArr.filter((pList) => {
                    if (pList.taskStatus == value) {
                        return pList;
                    }
                })
                this.setState({
                    projectTaskList: updatedTasks,
                })
            }
        }
    }
    render() {
        const { classes } = this.props;
        const {
            search, openProjects, taskListArr, projectInfo, projectId, projectTaskList, taskId,
            priorityChartOptions, statusChartOptions
        } = this.state;
        console.log(projectTaskList, taskListArr, search)
        return (
            <div className="recordFormRow">
                <span className="box-with-bg">
                    <AddTasks taskId={taskId} projectId={projectId} openProjects={openProjects} confirmModalClose={this.confirmModalClose} />
                    <div className="recordFormHead white-text">Project Details</div>
                    {
                        projectInfo.uid
                            ?
                            <div>
                                <p className="white-text-pad">Project Name: {projectInfo.projectName}</p>
                                <p className="white-text-pad">Description: {projectInfo.projectDesc}</p>
                                <p className="white-text-pad">Created Date: {new Date(projectInfo.createDate).toDateString()}</p>
                            </div>
                            :
                            <div>Project info not found....</div>
                    }
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
                    <div className="full-width text-right">
                        {
                            projectInfo && projectInfo.uid
                                ?
                                <div className="recordFormCol widthauto">
                                    <Button
                                        className="client newbtn greenbtn"
                                        type="button"
                                        onClick={() => this.openProjects()}
                                    >
                                        <p>
                                            {this.state.loading && (
                                                <CircularProgress
                                                    size={24}
                                                    className="buttonProgress"
                                                    color="secondary"
                                                />
                                            )}
                                            Add Tasks
                                        </p>
                                    </Button>
                                </div>
                                : null
                        }
                        <div className="recordFormCol widthauto">
                            <FormControl >
                                <FormGroup className="full-width setting_cards p-10">
                                    <input
                                        className="custom-input-box"
                                        label="Search"
                                        placeholder="Search"
                                        text="text"
                                        name="search"
                                        variant="filled"
                                        value={search}
                                        onChange={e => this.handleInput(e)}
                                    />
                                </FormGroup>
                            </FormControl>
                        </div>
                        <div className="recordFormCol widthauto">
                            <Button
                                className="client newbtn greenbtn"
                                type="button"
                                onClick={() => this.filterTasks()}
                            >
                                <p>
                                    {this.state.loading && (
                                        <CircularProgress
                                            size={24}
                                            className="buttonProgress"
                                            color="secondary"
                                        />
                                    )}
                                    Search
                                </p>
                            </Button>
                        </div>
                        <div className="recordFormCol widthauto">
                        </div>
                    </div>
                    <div className="full-width">
                        <GridContainer>
                            <CardBody>
                                <Paper className={(classes.root, this.cust_table_cover)}>
                                    <div className={(classes.tableWrapper, this.cust_table)}>
                                        <div className="table-respopnsive">
                                            <Table>
                                                <TableHead className={this.tableh}>
                                                    <TableRow>
                                                        <TableCell
                                                        >
                                                            Name
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            Description
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            Priority
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            <select
                                                                name="Task Status"
                                                                id=""
                                                                className="full-width-select"
                                                                value={this.state.taskStatus}
                                                                data-validators="isRequired,isAlpha"
                                                                onChange={e => this.handleTaskChange(e.target.value)}
                                                            >
                                                                <option value="all">All</option>
                                                                <option value="new">New</option>
                                                                <option value="progress">Progress</option>
                                                                <option value="done">Done</option>
                                                            </select>
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            Date
                                                        </TableCell>
                                                        <TableCell
                                                        >
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody key="TableBody">
                                                    {this.state.projectTaskList && this.state.projectTaskList.length
                                                        ? this.state.projectTaskList
                                                            .slice(
                                                                this.state.page * this.state.rowsPerPage,
                                                                this.state.page * this.state.rowsPerPage +
                                                                this.state.rowsPerPage
                                                            )
                                                            .map((row, key) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        role="checkbox"
                                                                        tabIndex={-1}
                                                                        key={key}
                                                                    >
                                                                        <TableCell>{row.taskName}</TableCell>
                                                                        <TableCell>{row.taskDescription}</TableCell>
                                                                        <TableCell>{row.taskPriority}</TableCell>
                                                                        <TableCell>{row.taskStatus}</TableCell>
                                                                        <TableCell>{new Date(row.createDate).toDateString()}</TableCell>
                                                                        <TableCell>
                                                                            <span className="edit-action">
                                                                                <Icon className="fa fa-pencil" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.editTask(row.uid)} />
                                                                            </span>
                                                                            <span className="edit-action">
                                                                                <Icon className="fa fa-trash" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.deleteTask(row.uid)} />
                                                                            </span>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        :
                                                        <TableRow>
                                                            <TableCell colspan='7'>
                                                                <div className="not-found-text">No tasks available...</div>
                                                            </TableCell>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    <TablePagination
                                        rowsPerPageOptions={PER_PAGE_OPTIONS}
                                        component="div"
                                        count={
                                            this.state.projectTaskList &&
                                                this.state.projectTaskList.length
                                                ? this.state.projectTaskList.length
                                                : 0
                                        }
                                        rowsPerPage={this.state.rowsPerPage}
                                        page={this.state.page}
                                        backIconButtonProps={{
                                            "aria-label": "previous page"
                                        }}
                                        nextIconButtonProps={{
                                            "aria-label": "next page"
                                        }}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </CardBody>
                        </GridContainer>
                    </div>
                </span>
            </div>
        );
    }
}

TasksClass.propTypes = {
    classes: PropTypes.object.isRequired
};

const Tasks = connect(
    mapStateToProps, mapDispatchToProps
)(TasksClass);

// export default Form;
export default withStyles(dashboardStyle)(Tasks);