import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import baseRoutes from "base-routes";
import { connect } from "react-redux";
import { useDispatch, useSelector } from 'react-redux';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    let authDataObj = useSelector((state) => state.authData);
    return (
        <Route {...rest} render={props => (
            authDataObj && authDataObj.accessToken
                ? <Component {...props} />
                : <Redirect to={{ pathname: baseRoutes.login.path }} />
        )} />
    );
}