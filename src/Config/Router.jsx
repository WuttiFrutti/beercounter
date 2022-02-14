
import { Switch, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { cloneElement } from 'react';
import { MainStore } from './MainStore';
import React from "react";
import LoginSwitch from './../Pages/LoggedOut/LoginSwitch';
import BottomNavigator from './../Components/Global/BottomNavigator';
import Navbar from '../Components/Global/Navbar';




import Page from '../Pages/Page';
import Wait from './../Pages/Wait';

const Join = React.lazy(() => import('./../Pages/Join'));
const Home = React.lazy(() => import('./../Pages/Home'));
const NotFound = React.lazy(() => import('./../Pages/404'));
const ManageLists = React.lazy(() => import('../Pages/ManageLists'));
const MyLists = React.lazy(() => import('../Pages/MyLists'));




const Router = () => {
  const location = useLocation();
  const user = MainStore.useState(s => s.user);

  const route = user !== false ? (
    <Wait><Switch location={location}>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/lijsten-beheren">
        <ManageLists />
      </Route>
      <Route path="/mijn-lijsten">
        <MyLists />
      </Route>
      <Route path="/join/:shareId">
        <Join />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
    </Wait>
  ) : (
    <LoginSwitch />
  );

  return <>
    {user !== false ? <Navbar /> : null}
    <TransitionGroup className={"transition-div"} childFactory={childFactoryCreator(location.state?.animation || "swap-right")}>
      <CSSTransition
        timeout={250}
        classNames={location.state?.animation || "swap-right"}
        key={user === false ? "Not-loaded" : location.key}
      ><Page style={user !== false ? { marginTop: "3em", paddingBottom: "5em" } : null}>{route}</Page>
      </CSSTransition>
    </TransitionGroup>
    {user !== false ? <BottomNavigator /> : null}
  </>

}

const childFactoryCreator = (classNames) => (
  (child) => (
    cloneElement(child, {
      classNames
    })
  )
);

export default Router;