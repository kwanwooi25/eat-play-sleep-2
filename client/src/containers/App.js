/** Dependancies */
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

/** Actions */
import * as actions from '../actions';

/** Components */
import MainContainer from './MainContainer/MainContainer';
import Login from './Login/Login';
import Home from './Home/Home';
import Logs from './Logs/Logs';
import ActivitySummary from './ActivitySummary/ActivitySummary';
import ActivityTrend from './ActivityTrend/ActivityTrend';
import Settings from './Settings/Settings';

/** Stylesheet */
import './App.scss';

/**
 * Public Routes
 * - can only be accessed when logged out
 */
const PUBLIC_ROUTES = [
  { path: '/', component: () => <Login /> },
];
const PublicRoute = ({ isLoggedIn, ...rest }) =>
  isLoggedIn === false ? <Route {...rest} /> : <Redirect to="/home" />;

/**
 * Private Routes
 * - can only be accessed when logged in
 */
const PRIVATE_ROUTES = [
  {
    path: '/home',
    component: () => (
      <MainContainer route='home'>
        <Home />
      </MainContainer>
    )
  },
  {
    path: '/logs',
    component: () => (
      <MainContainer route='logs'>
        <Logs />
      </MainContainer>
    )
  },
  {
    path: '/stats',
    component: () => <Redirect to='/stats/summary' />
  },
  {
    path: '/stats/summary',
    component: () => (
      <MainContainer route='stats'>
        <ActivitySummary />
      </MainContainer>
    )
  },
  {
    path: '/stats/feed',
    component: () => (
      <MainContainer route='stats'>
        <ActivityTrend activityName="feed" />
      </MainContainer>
    )
  },
  {
    path: '/stats/sleep',
    component: () => (
      <MainContainer route='stats'>
        <ActivityTrend activityName="sleep" />
      </MainContainer>
    )
  },
  {
    path: '/stats/diaper',
    component: () => (
      <MainContainer route='stats'>
        <ActivityTrend activityName="diaper" />
      </MainContainer>
    )
  },
  {
    path: '/stats/growth',
    component: () => (
      <MainContainer route='stats'>
        <ActivityTrend activityName="growth" />
      </MainContainer>
    )
  },
  {
    path: '/settings',
    component: () => (
      <MainContainer route='settings'>
        <Settings />
      </MainContainer>
    )
  },
];

const PrivateRoute = ({ isLoggedIn, ...rest }) =>
  isLoggedIn === false ? <Redirect to="/" /> : <Route {...rest} />;


class App extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  renderPublicRoutes = (routes, isLoggedIn) => {
    return routes.map(({ path, component }) => (
      <PublicRoute
        exact
        key={path}
        path={path}
        isLoggedIn={isLoggedIn}
        component={component}
      />
    ));
  }

  renderPrivateRoutes = (routes, isLoggedIn) => {
    return routes.map(({ path, component }) => (
      <PrivateRoute
        exact
        key={path}
        path={path}
        isLoggedIn={isLoggedIn}
        component={component}
      />
    ));
  }

  render() {
    const { isLoggedInAsGuest, isLoggedInAsUser, currentUser } = this.props.auth;
    const isLoggedIn = (isLoggedInAsGuest || isLoggedInAsUser) && currentUser;
    return (
      <BrowserRouter>
        <Switch>
          {this.renderPublicRoutes(PUBLIC_ROUTES, isLoggedIn)}
          {this.renderPrivateRoutes(PRIVATE_ROUTES, isLoggedIn)}
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ auth, Intl: { locale } }) => {
  return { auth, locale };
}

export default connect(mapStateToProps, actions)(App);
