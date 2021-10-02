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
import { projectList } from 'js/actions';
import { userService } from "_services/user.service";

const AddProject = (props) => {
    const { openProjects, confirmModalClose, loading, projectId } = props;
    const dispatch = useDispatch();
    let projectListArr = useSelector((state) => state.projectList);
    const updatedProject = projectListArr.filter((tList) => {
        if (tList.uid == projectId) {
            return tList;
        }
    })
    const errorList = {
        projectName: "",
        projectDescription: "",
    }
    const errorValidList = {
        projectName: false,
        projectDescription: false,
    }
    const [getProject, setProject] = useState("")
    const [getProjectDes, setProjectDes] = useState("")
    const [getError, setError] = useState(errorList)
    const [formValid, setFormValid] = useState(errorValidList)
    const [getProjectValid, setProjectValid] = useState(false)
    const [loader, setLoader] = useState(false)
    const [getProjectDescriptionValid, setProjectDescriptionValid] = useState(false)
    useEffect(() => {
        if (projectId) {
            if (updatedProject && updatedProject.length) {
                setProject(updatedProject[0].projectName);
                setProjectDes(updatedProject[0].projectDesc);
                setFormValid({})
            } else {
                const showNotification = {
                    title: 'Project Update',
                    message: 'Project not found',
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
        projectListArr = projectListArr && projectListArr.length ? projectListArr : [];
        if (projectId) {
            const updatedProject = projectListArr.filter((tList) => {
                if (tList.uid == projectId) {
                    tList.projectName = getProject;
                    tList.projectDesc = getProjectDes;
                }
                return tList;
            })
            dispatch(projectList(updatedProject));
        } else {
            const data = {
                uid: uid(),
                projectName: getProject,
                projectDesc: getProjectDes,
                createDate: new Date(),
            }
            projectListArr.push(data)
            dispatch(projectList(projectListArr));
        }
        setProject("");
        setProjectDes("");
        setLoader(false);
        setFormValid(errorValidList)
        confirmModalClose();
        const showNotification = {
            title: projectId ? 'Update Project' : 'Create Project',
            message: projectId ? 'Project updated successfully.' : 'Project created successfully.',
            type: "success",
        }
        userService.showNotification(showNotification);
    }
    const handleInput = (e) => {
        const { name, value } = e.target;
        let projectValid = getProjectValid;
        let projectDescriptionValid = getProjectDescriptionValid;
        let getErrorList = getError;
        let getFormValid = formValid;
        switch (name) {
            case 'projectName':
                setProject(value);
                projectValid = value.trim().length > 0;
                getErrorList.projectName = projectValid ? '' : "Enter project name";
                if (projectValid) {
                    delete getFormValid.projectName;
                } else {
                    getFormValid.projectName = false;
                }
                break;
            case 'projectDescription':
                setProjectDes(value);
                projectDescriptionValid = value.trim().length > 0;
                getErrorList.projectDescription = projectDescriptionValid ? '' : "Enter project description";
                if (projectDescriptionValid) {
                    delete getFormValid.projectDescription;
                } else {
                    getFormValid.projectDescription = false;
                }
                break;
        }
        setProjectValid(projectValid)
        setProjectDescriptionValid(projectDescriptionValid)
    }
    return (
        <Dialog
            className="call-modal"
            maxWidth={'lg'}
            open={openProjects}
        >
            <DialogTitle className="add-modal-title" id="discharge-planner-dialog-title">
                {projectId ? "Update" : "Create"} Project
                <IconButton aria-label="close">
                    <CloseIcon onClick={confirmModalClose} />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Project Name"
                            className="full-width-input"
                            name="projectName"
                            InputLabelProps={{ className: "required-label" }}
                            value={getProject}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={!getProjectValid}
                            formErrors={getError}
                            fieldName="projectName"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            id="standard-basic"
                            label="Project Description"
                            className="full-width-input"
                            name="projectDescription"
                            InputLabelProps={{ className: "required-label" }}
                            multiline
                            rows={3}
                            value={getProjectDes}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={!getProjectDescriptionValid}
                            formErrors={getError}
                            fieldName="projectDescription"
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
                        {projectId ? "Update" : "Create"}
                    </Button>
                    <Button color="primary" className="btn2" onClick={confirmModalClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddProject