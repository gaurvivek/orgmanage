import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    Select,
    DialogTitle,
    IconButton,
    TextField,
    MenuItem,
    InputLabel,
    Button
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormErrors } from "components/Login/FormErrors";
import { useDispatch, useSelector } from 'react-redux';
import { uid } from "__helpers/utils";
import { empList, reduxLoad } from 'js/actions';
import { userService } from "_services/user.service";

const AddTask = (props) => {
    const { openProjects, confirmModalClose, loading, projectId, taskId } = props;
    const dispatch = useDispatch();
    let taskListArr = useSelector((state) => state.taskList);
    const updatedTask = taskListArr.filter((tList) => {
        if (tList.uid == taskId) {
            return tList;
        }
    })
    const errorList = {
        taskName: "",
        taskDescription: "",
    }
    const errorValidList = {
        getTaskValid: true,
        getTaskDescriptionValid: true,
    }
    const [taskName, setTaskName] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [taskStatus, setTaskStatus] = useState("new")
    const [taskPriority, setTaskPriority] = useState("low")
    const [getError, setError] = useState(errorList)
    const [formValid, setFormValid] = useState(errorValidList)
    const [getProjectValid, setProjectValid] = useState(false)
    const [loader, setLoader] = useState(false)
    const [getProjectDescriptionValid, setProjectDescriptionValid] = useState(false)
    
    useEffect(() => {
        if(taskId){
            if (updatedTask && updatedTask.length){
                setTaskName(updatedTask[0].taskName);
                setTaskDescription(updatedTask[0].taskDescription);
                setTaskStatus(updatedTask[0].taskStatus);
                setTaskPriority(updatedTask[0].taskPriority);
                setFormValid({})
            }else{
                const showNotification = {
                    title: 'Task Update',
                    message: 'Task not found',
                    type: "danger",
                }
                userService.showNotification(showNotification);
                setTimeout(function () {
                    confirmModalClose();
                }, 1000);
            }
        }
    }, [openProjects])
    const validateForm = () => {
        console.log(formValid)
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(reduxLoad(false))
        taskListArr = taskListArr && taskListArr.length ? taskListArr : [];
        if (taskId) {
            const updatedTask = taskListArr.filter((tList) => {
                if (tList.uid == taskId) {
                    tList.taskName = taskName;
                    tList.taskDescription = taskDescription;
                    tList.taskPriority = taskPriority;
                    tList.taskStatus = taskStatus;
                }
                return tList;
            })
            dispatch(empList(updatedTask));
        } else {
            const data = {
                uid: uid(),
                projectId: projectId,
                taskName: taskName,
                taskDescription: taskDescription,
                taskPriority: taskPriority,
                taskStatus: taskStatus,
                createDate: new Date(),
            }
            taskListArr.push(data)
            dispatch(empList(taskListArr));
        }
        setTaskName("");
        setTaskDescription("");
        setTaskStatus("new");
        setTaskPriority("low");
        setLoader(false);
        setFormValid(errorValidList)
        dispatch(reduxLoad(true))
        const showNotification = {
            title: taskId ? 'Update Task' : 'Create Task',
            message: taskId ? 'Task updated successfully.' : 'Task created successfully.',
            type: "success",
        }
        userService.showNotification(showNotification);
        setTimeout(function () {
            confirmModalClose();
        }, 100);
    }
    const handleInput = (e) => {
        const { name, value } = e.target;
        let getErrorList = getError;
        let getFormValid = formValid;
        switch (name) {
            case 'taskName':
                setTaskName(value);
                let projectValid = value.trim().length > 0;
                getErrorList.taskName = projectValid ? '' : "Enter task name";
                if (projectValid) {
                    delete getFormValid.getTaskValid;
                } else {
                    getFormValid.getTaskValid = true;
                }
                break;
            case 'taskDescription':
                setTaskDescription(value);
                let projectDescriptionValid = value.trim().length > 0;
                getErrorList.taskDescription = projectDescriptionValid ? '' : "Enter task description";
                if (projectDescriptionValid) {
                    delete getFormValid.getTaskDescriptionValid;
                } else {
                    getFormValid.getTaskDescriptionValid = true;
                }
                break;
            case 'taskStatus':
            // setTaskStatus(value);
            case 'taskPriority':
            // setTaskPriority(value);
        }
    }
    return (
        <Dialog
            className="call-modal"
            maxWidth={'lg'}
            open={openProjects}
        >
            <DialogTitle className="add-modal-title" id="discharge-planner-dialog-title">
                {taskId ? "Update" : "Create"} Tasks
                <IconButton aria-label="close">
                    <CloseIcon onClick={confirmModalClose} />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Task Name"
                            className="full-width-input"
                            name="taskName"
                            InputLabelProps={{ className: "required-label" }}
                            value={taskName}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.getTaskValid}
                            formErrors={getError}
                            fieldName="taskName"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            label="Task Priority"
                            select
                            InputLabelProps={{ className: "required-label" }}
                            name="taskPriority"
                            className="full-width-input"
                            autoComplete="off"
                            value={taskPriority}
                            data-validators="isRequired,isAlpha"
                            onChange={e => setTaskPriority(e.target.value)}
                        >
                            <MenuItem
                                value={"low"}
                            >
                                Low
                            </MenuItem>
                            <MenuItem
                                value={"medium"}
                            >
                                Medium
                            </MenuItem>
                            <MenuItem
                                value={"high"}
                            >
                                High
                            </MenuItem>
                        </TextField>
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            label="Task Status"
                            select
                            InputLabelProps={{ className: "required-label" }}
                            name="taskStatus"
                            className="full-width-input"
                            autoComplete="off"
                            value={taskStatus}
                            data-validators="isRequired,isAlpha"
                            onChange={e => setTaskStatus(e.target.value)}
                        >
                            <MenuItem
                                value={"new"}
                            >
                                New
                            </MenuItem>
                            <MenuItem
                                value={"progress"}
                            >
                                Progress
                            </MenuItem>
                            <MenuItem
                                value={"done"}
                            >
                                Done
                            </MenuItem>
                        </TextField>
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            id="standard-basic"
                            label="Task Description"
                            className="full-width-input"
                            name="taskDescription"
                            InputLabelProps={{ className: "required-label" }}
                            multiline
                            rows={3}
                            value={taskDescription}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.getTaskDescriptionValid}
                            formErrors={getError}
                            fieldName="taskDescription"
                        />
                    </div>
                </DialogContent>
                <DialogActions className="modal-actions" justify="center">
                    <Button type="submit" className="btn1" disabled={Object.entries(formValid || {}).length > 0 || loader}>
                        {loading && (
                            <CircularProgress
                                size={24}
                                className="buttonProgress"
                            />
                        )}
                        {taskId ? "Update" : "Create"}
                    </Button>
                    <Button color="primary" className="btn2" onClick={confirmModalClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddTask