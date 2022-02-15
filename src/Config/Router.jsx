
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
import styled from "styled-components";
import { useTheme } from '@mui/system';

const Join = React.lazy(() => import('./../Pages/Join'));
const Home = React.lazy(() => import('./../Pages/Home'));
const NotFound = React.lazy(() => import('./../Pages/404'));
const ManageLists = React.lazy(() => import('../Pages/ManageLists'));
const MyLists = React.lazy(() => import('../Pages/MyLists'));



const BackgroundTransition = styled(TransitionGroup)(({style, sx, darkMode}) => {
  return {
      backgroundImage: darkMode ? "url(/wavedark.svg)" : "url(/wavelight.svg)",
      backgroundPosition: "bottom",
      backgroundRepeat: "no-repeat",
      backgroundColor: darkMode ? "#121212" : "#F9FAFC", 
      ...style,
      ...sx
  }
})

const Router = () => {
  const isDarkTheme = useTheme().palette.mode === 'dark';
  const location = useLocation();
  const user = MainStore.useState(s => s.user);

  const addNav = [
    "/",
    "/lijsten-beheren",
    "/mijn-lijsten",
    "/gesloten"
  ];

  const addBottom = [
    "/",
    "/lijsten-beheren",
    "/mijn-lijsten"
  ]

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
      <Route path="/gesloten">
        {"yeet!"}
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
    {user !== false && addNav.includes(location.pathname) ? <Navbar/> : null}
    <BackgroundTransition darkMode={isDarkTheme} className={"transition-div"} childFactory={childFactoryCreator(location.state?.animation || "swap-right")}>
      <CSSTransition
        timeout={250}
        classNames={location.state?.animation || "swap-right"}
        key={user === false ? "Not-loaded" : location.key}
      ><Page style={user !== false && addNav.includes(location.pathname) ? { marginTop: "4em", paddingBottom: "5em" } : null}>{route}</Page>
      </CSSTransition>
    </BackgroundTransition>
    {user !== false && addBottom.includes(location.pathname) ? <BottomNavigator/> : null}
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