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
import { empList, reduxLoad } from 'js/actions';

am4core.useTheme(am4themes_animated);
const ref = React.createRef();
function mapDispatchToProps(dispatch) {
  return {
    // addArticle: article => dispatch(addArticle(article))
    empList: projects => dispatch(empList(projects))
  };
}
const mapStateToProps = state => {
  return {
    timestamp: state.timestamp,
    campaings: state.campaings,
    reduxLoadFlag: state.reduxLoadFlag,
    empListArr: state.empList,
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
      empListArr: this.props.empListArr ? this.props.empListArr : [],
      projectId: "",
      search: "",
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.confirmModalClose = this.confirmModalClose.bind(this);
    this.filterEmps = this.filterEmps.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    document.title = 'Employees';
  }
  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage
    });
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
  filterEmps() {
    const allEmp = this.props.empListArr;
    const searchRes = this.state.search;
    if (!searchRes) {
      this.setState({
        empListArr: allEmp
      })
      return false;
    }
    const updatedEmps = allEmp.filter((pList) => {
      if (pList.name.toLowerCase().includes(searchRes.toLowerCase()) || pList.email.toLowerCase().includes(searchRes.toLowerCase()) || pList.phoneNo.includes(searchRes.toLowerCase()) || pList.age.includes(searchRes.toLowerCase()) || pList.gender.toLowerCase().includes(searchRes.toLowerCase())) {
        return pList;
      }
    })
    this.setState({
      empListArr: updatedEmps
    })
  }
  openProjects() {
    this.setState({ openProjects: true })
  }
  confirmModalClose() {
    this.setState({
      projectId: "",
      openProjects: false,
      empListArr: this.props.empListArr,
    })
  }
  editEmps(empId) {
    this.setState({
      empId: empId,
      openProjects: true,
    })
  }
  deleteEmp(empId) {
    const empListArr = this.state.empListArr;
    const updatedEmpList = empListArr.filter((tList) => {
      return tList.id == empId ? null : tList;
    })
    this.props.empList(updatedEmpList);
    this.setState({
      empListArr: updatedEmpList,
    })
  }
  render() {
    const { classes } = this.props;
    const {
      openProjects, empListArr, empId, search
    } = this.state;
    console.log(search)
    return (
      <div className="recordFormRow">
        <span className="box-with-bg">
          <AddProject empId={empId} openProjects={openProjects} confirmModalClose={this.confirmModalClose} />
          <div className="recordFormHead white-text">Employees</div>
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
                  Add Employee
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
                onClick={() => this.filterEmps()}
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody key="TableBody">
                          {
                            this.state.empListArr.length &&
                              this.state.empListArr.length
                              ? this.state.empListArr
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
                                      <TableCell>{row.name}</TableCell>
                                      <TableCell>{row.email}</TableCell>
                                      <TableCell>{row.phoneNo}</TableCell>
                                      <TableCell>{row.age}</TableCell>
                                      <TableCell>{row.gender}</TableCell>
                                      <TableCell>{new Date(row.createDate).toDateString()}</TableCell>
                                      <TableCell>
                                        {/* <span className="edit-action">
                                          <Link
                                            underline="none"
                                            to={
                                              {
                                                pathname: basePath + baseRoutes.tasks.path,
                                                state: row.id
                                              }
                                            }
                                          >
                                            <Icon className="fa fa-eye" aria-hidden="true" style={{ color: "#fff" }} />
                                          </Link>
                                        </span> */}
                                        <span className="edit-action">
                                          <Icon className="fa fa-pencil" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.editEmps(row.id)} />
                                        </span>
                                        <span className="edit-action">
                                          <Icon className="fa fa-trash" aria-hidden="true" style={{ color: "#fff" }} onClick={() => this.deleteEmp(row.id)} />
                                        </span>
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
                      this.state.empListArr.length &&
                        this.state.empListArr.length
                        ? this.state.empListArr.length
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