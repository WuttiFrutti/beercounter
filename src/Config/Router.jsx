import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { cloneElement } from 'react';
import { MainStore } from './MainStore';
import React from "react";
import LoginSwitch from './../Pages/LoggedOut/LoginSwitch';
import { joinList } from './Axios';


import Page from '../Pages/Page';
import Wait from './../Pages/Wait';
import styled from "styled-components";
import { useTheme } from '@mui/system';
import { matchPath } from "react-router-dom/cjs/react-router-dom.min";
import { openSnack } from "./UIStore";
import { retrieveEndedLists, retrieveLatestTag, timeout } from './Axios';



const promises = {
  NotFound: () => import('./../Pages/404'),
  SingleList: () => import('./../Pages/SingleList'),
  MainPages: () => import('./../Components/Global/MainPages.jsx'),
  Profile: () => (async () => {
    if (MainStore.currentState.version === false) {
      try {
        await retrieveLatestTag()
      } catch (e) { }
    }
    if (MainStore.currentState.ended === false) {
      await retrieveEndedLists()

    }
    return await import('./../Pages/Profile.jsx')
  })(),
}



const NotFound = React.lazy(promises.NotFound);
const SingleList = React.lazy(promises.SingleList);
const MainPages = React.lazy(promises.MainPages);
const Profile = React.lazy(promises.Profile);







const BackgroundTransition = styled(TransitionGroup)(({ style, sx, darkMode }) => {
  return {
    backgroundImage: darkMode ? "url(/wavedark.svg)" : "url(/wavelight.svg)",
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundColor: darkMode ? "#121212" : "#F9FAFC",
    backgroundAttachment: "fixed",
    ...style,
    ...sx
  }
});


const paths = [
  {
    path: "/lijst/:list",
    component: () => <SingleList />
  },
  {
    path: "/join/:shareId",
    component: (args) => {
      const { match, history } = args;
      joinList(match.params.shareId).then(() => {
        openSnack(<>Je doet nu mee aan de lijst!</>, "info");
        history.push("/home");
        Promise.resolve();
      }).catch((e) => {
        history.push("/home");
        Promise.reject()
      });

      return <></>;
    },
  },
  {
    path: "/profiel",
    component: () => <Profile />
  },
  {
    path: "/home",
    noAnimation: true,
    component: (args) => <MainPages {...args} />
  },
  {
    path: "/",
    component: (args) => {
      args.history.replace("/home")

      return <></>
    },
  },
  {
    path: "*",
    component: () => <NotFound />
  }
]

const Router = () => {
  const isDarkTheme = useTheme().palette.mode === 'dark';
  const location = useLocation();
  const history = useHistory();

  const [loaded, setLoaded] = React.useState(false)
  const user = MainStore.useState(s => s.user);

  const options = paths.find(options => matchPath(location.pathname, { path: options.path, exact: options.exact }));
  const match = matchPath(location.pathname, { path: options.path, exact: options.exact });


  const route = loaded && user ? (
    <Wait>
      {
        <Switch location={location}>
          <Route path={options.path} exact={options.exact}>{<options.component match={match} options={options} history={history} />}</Route>
        </Switch>
      }
    </Wait>
  ) : (
    <LoginSwitch setLoaded={setLoaded} promise={options.component} />
  );

  const animation = location.state?.animation === undefined ? "swap-right" : location.state.animation || "";
  if (location.state) location.state.animation = "swap-right";

  return <>
    <BackgroundTransition className={"transition-div"} childFactory={childFactoryCreator(animation)}>
      {<CSSTransition
        className={"transition-div-child"}
        timeout={250}
        classNames={animation}
        key={!loaded ? "Not-loaded" : user ? options.noAnimation || location.key : "user"}
      >
        <Page>{route}</Page>
      </CSSTransition>
      }
    </BackgroundTransition>
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