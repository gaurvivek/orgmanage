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

const AddEmp = (props) => {
    const { openProjects, confirmModalClose, loading, projectId, empId } = props;
    const dispatch = useDispatch();
    let empListArr = useSelector((state) => state.empList);
    const empDetails = empListArr.filter((eList) => {
        if (eList.id == empId) {
            return eList;
        }
    });
    const errorList = {
        eName: "",
        eAge: "",
        eEmail: "",
        ePhone: "",
    }
    const errorValidList = {
        eNameValid: true,
        eAgeValid: true,
        eEmailValid: true,
        ePhoneValid: true,
    }
    const [eName, setEName] = useState("")
    const [eAge, setEAge] = useState("")
    const [eEmail, setEEmail] = useState("")
    const [ePhone, setEPhone] = useState("")
    const [eGender, setEGender] = useState("male")
    const [getError, setError] = useState(errorList)
    const [formValid, setFormValid] = useState(errorValidList)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (empId) {
            if (empDetails && empDetails.length) {
                setEName(empDetails[0].name);
                setEAge(empDetails[0].age);
                setEEmail(empDetails[0].email);
                setEPhone(empDetails[0].phoneNo);
                setEGender(empDetails[0].gender);
                setFormValid({})
            } else {
                const showNotification = {
                    title: 'Employee Update',
                    message: 'Employee details not found',
                    type: "danger",
                }
                userService.showNotification(showNotification);
                setTimeout(function () {
                    confirmModalClose();
                }, 1000);
            }
        }
    }, [openProjects])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(reduxLoad(false))
        empListArr = empListArr && empListArr.length ? empListArr : [];
        // check duplicate phone and email
        let isEmailDuplicate = false;
        empListArr.map((eList) => {
            if (eList.email == eEmail && (!empId || eList.id != empId)) {
                isEmailDuplicate = true;
                return;
            }
        })
        if (isEmailDuplicate) {
            let newData = {}
            if (isEmailDuplicate){
                errorList.eEmail = "Email should be unique";
                newData.eEmailValid = true
            }
            setError(errorList);
            setFormValid(newData);
            setLoader(false);
            console.log(errorList, newData)
            return false;
        }
        if (empId) {
            const updatedEmp = empListArr.filter((tList) => {
                if (tList.id == empId) {
                    tList.name = eName;
                    tList.email = eEmail;
                    tList.gender = eGender;
                    tList.age = eAge;
                    tList.phoneNo = ePhone;
                }
                return tList;
            })
            dispatch(empList(updatedEmp));
        } else {
            const data = {
                id: uid(),
                name: eName,
                email: eEmail,
                gender: eGender,
                age: eAge,
                phoneNo: ePhone,
                createDate: new Date(),
            }
            empListArr.push(data)
            dispatch(empList(empListArr));
        }
        setEName("")
        setEAge("")
        setEEmail("")
        setEPhone("")
        setEGender("male")
        setLoader(false);
        setFormValid(errorValidList)
        dispatch(reduxLoad(true))
        const showNotification = {
            title: empId ? 'Update Employee' : 'Create Employee',
            message: empId ? 'Employee updated successfully.' : 'Employee created successfully.',
            type: "success",
        }
        userService.showNotification(showNotification);
        setTimeout(function () {
            confirmModalClose();
        }, 100);
    }
    const handleInput = (e) => {
        let { name, value } = e.target;
        let getErrorList = getError;
        let getFormValid = formValid;
        const re = /^\d+\.?\d{0,2}$/;
        switch (name) {
            case 'eName':
                setEName(value);
                let eNameValid = value.trim().length > 0;
                getErrorList.eName = eNameValid ? '' : "Enter employee name";
                if (eNameValid) {
                    delete getFormValid.eNameValid;
                } else {
                    getFormValid.eNameValid = true;
                }
                break;
            case 'eEmail':
                setEEmail(value);
                let eEmailValid = value.trim().length > 0;
                getErrorList.eEmail = eEmailValid ? '' : "Enter employee email";
                if (eEmailValid) {
                    delete getFormValid.eEmailValid;
                } else {
                    getFormValid.eEmailValid = true;
                }
                break;
            case 'eAge':
                setEAge(value);
                let eAgeValid = value > 0 && value <= 150;
                getErrorList.eAge = eAgeValid ? '' : "Enter employee age between 1 to 150 years";
                if (eAgeValid) {
                    delete getFormValid.eAgeValid;
                } else {
                    getFormValid.eAgeValid = true;
                }
                break;
            case 'ePhone':
                if (value === '' || re.test(value)) {
                    value = value
                } else {
                    if (re.test(eName))
                        value = eName;
                    else
                        value = 0;
                }
                setEPhone(value);
                let ePhoneValid = true;
                if (value > 0){
                    if (value.length != 10){
                        ePhoneValid = false
                        getErrorList.ePhone = "Phone number must be 10 digit long";
                    }
                }else{
                    ePhoneValid = false
                    getErrorList.ePhone = "Enter employee phone number";
                }
                
                if (ePhoneValid) {
                    delete getFormValid.ePhoneValid;
                } else {
                    getFormValid.ePhoneValid = true;
                }
                break;
        }
    }
    return (
        <Dialog
            className="call-modal"
            maxWidth={'lg'}
            open={openProjects}
        >
            <DialogTitle className="add-modal-title" id="discharge-planner-dialog-title">
                {empId ? "Update" : "Create"} Employee
            </DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Employee Name"
                            className="full-width-input"
                            name="eName"
                            InputLabelProps={{ className: "required-label" }}
                            value={eName}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.eNameValid}
                            formErrors={getError}
                            fieldName="eName"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Employee Email"
                            className="full-width-input"
                            name="eEmail"
                            InputLabelProps={{ className: "required-label" }}
                            value={eEmail}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.eEmailValid}
                            formErrors={getError}
                            fieldName="eEmail"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Employee Phone"
                            className="full-width-input"
                            name="ePhone"
                            InputLabelProps={{ className: "required-label" }}
                            value={ePhone}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.ePhoneValid}
                            formErrors={getError}
                            fieldName="ePhone"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            id=""
                            label="Employee Age"
                            className="full-width-input"
                            name="eAge"
                            type="number"
                            InputLabelProps={{ className: "required-label" }}
                            value={eAge}
                            onChange={e => handleInput(e)} />
                        <FormErrors
                            show={formValid.eAgeValid}
                            formErrors={getError}
                            fieldName="eAge"
                        />
                    </div>
                    <div className="dollar_modal">
                        <TextField
                            label="Employee Gender"
                            select
                            InputLabelProps={{ className: "required-label" }}
                            name="eGender"
                            className="full-width-input"
                            autoComplete="off"
                            value={eGender}
                            data-validators="isRequired,isAlpha"
                            onChange={e => setEGender(e.target.value)}
                        >
                            <MenuItem
                                value={"male"}
                            >
                                Male
                            </MenuItem>
                            <MenuItem
                                value={"female"}
                            >
                                Female
                            </MenuItem>
                            <MenuItem
                                value={"other"}
                            >
                                Other
                            </MenuItem>
                        </TextField>
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
                        {empId ? "Update" : "Create"}
                    </Button>
                    <Button color="primary" className="btn2" onClick={confirmModalClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddEmp