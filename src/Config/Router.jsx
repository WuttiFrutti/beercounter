import { Switch, Route, useLocation, useHistory, useParams } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { cloneElement } from 'react';
import { MainStore } from './MainStore';
import React from "react";
import LoginSwitch from './../Pages/LoggedOut/LoginSwitch';
import BottomNavigator from './../Components/Global/BottomNavigator';
import Navbar from '../Components/Global/Navbar';
import { joinList } from './Axios';



import Page from '../Pages/Page';
import Wait from './../Pages/Wait';
import styled from "styled-components";
import { useTheme } from '@mui/system';
import { matchPath } from "react-router-dom/cjs/react-router-dom.min";

const promises = {
  Home: () => import('./../Pages/Home'),
  NotFound: () => import('./../Pages/404'),
  ManageLists: () => import('./../Pages/ManageLists'),
  MyLists: () => import('./../Pages/MyLists'),
  SingleList: () => import('./../Pages/SingleList'),
}


const NotFound = React.lazy(promises.NotFound);
const SingleList = React.lazy(promises.SingleList);


const ManageLists = React.lazy(promises.ManageLists);
const Home = React.lazy(promises.Home);
const MyLists = React.lazy(promises.MyLists);


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

const MainPages = (args) => {
  const location = useLocation();

  const localPages = {
    "/mijn-lijsten": 0,
    "/": 1,
    "/lijsten-beheren": 2
  }

  return <>
    <Navbar />
    <div className="swap-page-wrapper-wrapper" style={{ transform: `translate(-${localPages[location.pathname] * 33.33}%,0)` }}>
      <div className="swap-page-wrapper"><MyLists /></div>
      <div className="swap-page-wrapper"><Home /></div>
      <div className="swap-page-wrapper"><ManageLists /></div>
    </div>
    <BottomNavigator />
  </>
}

const paths = [
  {
    path: ["/", "/mijn-lijsten", "/lijsten-beheren"],
    noAnimation: true,
    component: (...args) => <MainPages {...args} />,
    promise: ({ path }) => async () => {
      await promises.Home();
      await promises.ManageLists();
      await promises.MyLists();
    },
    exact: true
  },
  {
    path: "/lijst/:list",
    component: () => <SingleList />,
    promise: () => promises.SingleList
  },
  {
    path: "/join/:shareId",
    component: () => { },
    promise: ({ params }, history) => {
      return joinList(params.shareId).then(() => {
        history.push("/");
        MainStore.update(s => ({ ...s, snack: { open: true, severity: "info", children: <>Je doet nu mee aan de lijst!</> } }));
        return Promise.resolve();
      }).catch((e) => {
        console.log(e);
        history.push("/");
        return Promise.reject()
      });
    }
  },
  {
    path: "*",
    component: () => <NotFound />,
    promise: () => promises.NotFound
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
          <Route path={options.path} exact={options.exact}>{<options.component {...options} />}</Route>
        </Switch>
      }
    </Wait>
  ) : (
    <LoginSwitch setLoaded={setLoaded} promise={options.promise(match, history)} />
  );

  const animation = location.state?.animation === undefined ? "swap-right" : location.state.animation || "";
  if(location.state) location.state.animation = "swap-right";

  return <>
    <BackgroundTransition darkMode={isDarkTheme} className={"transition-div"} childFactory={childFactoryCreator(animation)}>
      {<CSSTransition
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