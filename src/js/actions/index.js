import {
    REDUX_LOAD,
    DATA_LOADING_REDUX,
    STORED_TIMESTAMP,
    FETCH_EMP_LIST,
    FETCH_USER_DATA,
    FETCH_AUTH_DATA,
} from "../constants/action-types";

export function reduxLoad(payload) {
    return { type: REDUX_LOAD, payload }
};
export function dataLoadingFlag(payload) {
    return { type: DATA_LOADING_REDUX, payload }
};
export function addTimeStamp(payload) {
    return { type: STORED_TIMESTAMP, payload }
};
export function empList(payload) {
    return { type: FETCH_EMP_LIST, payload }
};
export function userdata(payload) {
    return { type: FETCH_USER_DATA, payload }
};
export function authData(payload) {
    return { type: FETCH_AUTH_DATA, payload }
};