import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import FirebaseService from './services/FirebaseService'

import Login from './pages/Login/login';
import Register from './pages/Register/register';
import RegisterWorkShop from './pages/RegisterWorkShop/registerWorkShop';
import Home from './pages/Home/home';
import Config from './pages/Config/config';
import WokShop from './pages/WorkShop/workShop'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            FirebaseService.verifyIdToken(localStorage.getItem('infoUser')) ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: "/", state: {from: props.location} }} />
                )} />
);

const Routes = (props) => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/registerWorkShop" component={RegisterWorkShop} />
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/config" component={Config} />
            <PrivateRoute path="/workShop" component={WokShop} />
        </Switch>
    </BrowserRouter>
);

export default Routes;