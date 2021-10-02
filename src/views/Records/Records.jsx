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
  FormControl, TextField
} from "@material-ui/core";
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
import AddProject from "./ProjectPopup"
import { basePath, baseRoutes } from "base-routes";
import Icon from '@material-ui/core/Icon';
import { Link } from "react-router-dom";
import { projectList, reduxLoad } from 'js/actions';

am4core.useTheme(am4themes_animated);
const columns = [
  { id: "projectName", label: "Project Name" },
  { id: "projectDesc", label: "Project Description" },
  { id: "projectDesc", label: "Total Tasks" },
  { id: "projectDesc", label: "Tasks List" },
  { id: "createDate", label: "Created Date" },
  { id: "projectDesc", label: "Actions" },
];
const ref = React.createRef();
function mapDispatchToProps(dispatch) {
  return {
    // addArticle: article => dispatch(addArticle(article))
    projectList: projects => dispatch(projectList(projects))
  };
}
const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    timestamp: state.timestamp,
    campaings: state.campaings,
    reduxLoadFlag: state.reduxLoadFlag,
    projectListArr: state.projectList,
    taskListArr: state.taskList,
  };
};
class RecordClass extends React.Component {
  constructor(props) {
    super(props);
    this.dateUtility = new DateFnsUtils();
    this._isMounted = false;
    this.state = {
      value: 0,
      page: 0,
      loading: false,
      rowsPerPageT: RECORD_PER_PAGE,
      rowsPerPage: RECORD_PER_PAGE,
      timeStampVal: new Date().toLocaleTimeString(),
      reduxLoadFlag: false,
      openProjects: false,
      projectListArr: this.props.projectListArr ? this.props.projectListArr : [],
      taskList: this.props.taskListArr ? this.props.taskListArr : [],
      projectId: "",
      search: "",
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.confirmModalClose = this.confirmModalClose.bind(this);
    this.filterProjects = this.filterProjects.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    document.title = 'Projects';
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
  handleInput(e) {
    const { value } = e.target;
    this.setState({
      search: value,
    })
  }
  filterProjects() {
    const allProjects = this.props.projectListArr;
    const searchRes = this.state.search;
    console.log(searchRes, allProjects, this.state.search)
    if (!searchRes) {
      this.setState({
        projectListArr: allProjects
      })
      return false;
    }
    const updatedProjects = allProjects.filter((pList) => {
      if (pList.projectName.toLowerCase().includes(searchRes.toLowerCase()) || pList.projectDesc.toLowerCase().includes(searchRes.toLowerCase())) {
        return pList;
      }
    })
    this.setState({
      projectListArr: updatedProjects
    })
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
      projectId: "",
      openProjects: false,
      projectListArr: this.props.projectListArr,
    })
  }
  GetTaskCount = (pId, tList) => {
    const filteredTasks = tList.filter((list) => {
      if (list.projectId == pId) {
        return list
      }
    })
    return filteredTasks.length;
  }
  GetTaskList = (pId, tList) => {
    const taskList = {}
    tList.map((list) => {
      if (list.projectId == pId) {
        console.log(list.taskStatus)
        if (list.taskStatus == "new") {
          taskList.new = taskList.new ? taskList.new + 1 : 1;
        } else if (list.taskStatus == "progress") {
          taskList.progress = taskList.progress ? taskList.progress + 1 : 1;
        } else {
          taskList.done = taskList.done ? taskList.done + 1 : 1;
        }
      }
    })
    console.log(taskList)
    return (
      <div>
        {taskList.done ? <p>Done: {taskList.done}</p> : null}
        {taskList.new ? <p>New: {taskList.new}</p> : null}
        {taskList.progress ? <p>Progress: {taskList.progress}</p> : null}
      </div>
    )
  }
  editProject(projectId) {
    this.setState({
      projectId: projectId,
      openProjects: true,
    })
  }
  deleteProject(projectId) {
    const projectListArr = this.state.projectListArr;
    const updatedTaskList = projectListArr.filter((tList) => {
      return tList.uid == projectId ? null : tList;
    })
    this.props.projectList(updatedTaskList);
    this.setState({
      projectListArr: updatedTaskList,
    })
  }
  render() {
    const { classes } = this.props;
    const {
      openProjects, projectListArr, taskList, projectId, search
    } = this.state;
    console.log(search)
    return (
      <div className="recordFormRow">
        <span className="box-with-bg">
          <AddProject projectId={projectId} openProjects={openProjects} confirmModalClose={this.confirmModalClose} />
          <div className="recordFormHead white-text">My Projects</div>
          <div className="full-width text-right">
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
                  Add Project
                </p>
              </Button>
            </div>
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
                onClick={() => this.filterProjects()}
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
                            {columns.map(column => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody key="TableBody">
                          {
                            this.state.projectListArr.length &&
                              this.state.projectListArr.length
                              ? this.state.projectListArr
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
                                      <TableCell>{row.projectName}</TableCell>
                                      <TableCell>{row.projectDesc}</TableCell>
                                      <TableCell>
                                        {
                                          taskList && taskList.length
                                            ?
                                            this.GetTaskCount(row.uid, taskList)
                                            :
                                            "No task"
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {
                                          taskList && taskList.length
                                            ?
                                            this.GetTaskList(row.uid, taskList)
                                            :
                                            "No task"
                                        }
                                      </TableCell>
                                      <TableCell>{new Date(row.createDate).toDateString()}</TableCell>
                                      <TableCell>
                                        <span className="edit-action">
                                          <Link
                                            underline="none"
                                            to={
                                              {
                                                pathname: basePath + baseRoutes.tasks.path,
                                                state: row.uid
                                              }
                                            }
                                          >
                                            <Icon className="fa fa-eye" aria-hidden="true" style={{ color: "#fff" }} />
                                          </Link>
                                        </span>
                                        <span className="edit-action">
                                          <Icon className="fa fa-pencil" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.editProject(row.uid)} />
                                        </span>
                                        {
                                          this.GetTaskCount(row.uid, taskList) == 0
                                            ?
                                            <span className="edit-action">
                                              <Icon className="fa fa-trash" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.deleteProject(row.uid)} />
                                            </span>
                                            :
                                            null
                                        }
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              :
                              <TableRow>
                                <TableCell colspan='7'>
                                  <div className="not-found-text">No projects available...</div>
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
                      this.state.projectListArr.length &&
                        this.state.projectListArr.length
                        ? this.state.projectListArr.length
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

RecordClass.propTypes = {
  classes: PropTypes.object.isRequired
};

const Record = connect(
  mapStateToProps, mapDispatchToProps
)(RecordClass);

// export default Form;
export default withStyles(dashboardStyle)(Record);