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
  Join: () => import('./../Pages/Join'),
  Home: () => import('./../Pages/Home'),
  NotFound: () => import('./../Pages/404'),
  ManageLists: () => import('./../Pages/ManageLists'),
  MyLists: () => import('./../Pages/MyLists'),
  SingleList: () => import('./../Pages/SingleList'),
}


const Join = React.lazy(promises.Join);
const Home = React.lazy(promises.Home);
const NotFound = React.lazy(promises.NotFound);
const ManageLists = React.lazy(promises.ManageLists);
const MyLists = React.lazy(promises.MyLists);
const SingleList = React.lazy(promises.SingleList);




const BackgroundTransition = styled(TransitionGroup)(({style, sx, darkMode}) => {
  return {
      backgroundImage: darkMode ? "url(/wavedark.svg)" : "url(/wavelight.svg)",
      backgroundPosition: "bottom",
      backgroundRepeat: "no-repeat",
      backgroundSize:"cover",
      backgroundColor: darkMode ? "#121212" : "#F9FAFC",
      backgroundAttachment:"fixed",
      ...style,
      ...sx
  }
})

const paths = {
  "/":{
    addNav: true,
    addBottom: true,
    component: <Home />,
    promise: () => promises.Home,
    exact: true
  },
  "/lijsten-beheren":{
    addNav: true,
    addBottom: true,
    component: <ManageLists />,
    promise: () => promises.ManageLists
  },
  "/lijst/:list":{
    addNav: true,
    addBottom: true,
    component: <SingleList />,
    promise: () => promises.SingleList
  },
  "/mijn-lijsten":{
    addNav: true,
    addBottom: true,
    component: <MyLists />,
    promise: () => promises.MyLists
  },
  "/join/:shareId":{
    addNav: true,
    addBottom: true,
    component: {},
    promise: ({ params },history) => {
      return joinList(params.shareId).then(() => {
        history.push("/");
        MainStore.update(s => ({ ...s ,snack:{ open:true, severity:"info", children:<>Je doet nu mee aan de lijst!</> }  }));
        return Promise.resolve();
      }).catch((e) => {
        console.log(e);
        history.push("/");
        return Promise.reject()
      });
    }
  },
  "*":{
    addNav: false,
    addBottom: false,
    component: <NotFound />,
    promise: () => promises.NotFound
  }
}

const Router = () => {
  const isDarkTheme = useTheme().palette.mode === 'dark';
  const location = useLocation();
  const history = useHistory();
<<<<<<< HEAD
=======
  const params = useParams();
  const switchRef = React.useRef();
>>>>>>> 4e53525e4868c5a32988521dd76f2e7d34a4a0ea

  const [loaded, setLoaded] = React.useState(false)
  const user = MainStore.useState(s => s.user);

<<<<<<< HEAD
  const [path, options] = Object.entries(paths).find(([path, options]) => matchPath(location.pathname, { path:path, exact:options.exact }))
  const match = matchPath(location.pathname, { path:path, exact:options.exact });

  const route = loaded && user ? (
    <Wait>
     <Switch location={location}><Route path={path} exact={options.exact}>{options.component}</Route></Switch> 
    </Wait>
  ) : (
    <LoginSwitch setLoaded={setLoaded} promise={options.promise(match,history)}/>
=======
  console.log(params, location, history);

  const matchedRoute = Object.entries(paths).reduce((a, [path, obj]) => {
    if(matchPath(location.pathname, {
      path:path,
      exact:obj.exact
    })){
      return {
        ...obj,
        path:path
      }
    }
  }, {})

  const route = loaded && user ? (
    <Wait>
      <Switch location={location}>
        {Object.entries(paths).map(([path, options]) => <Route key={path} path={path} exact={options.exact}>{options.component}</Route>)}
      </Switch>
    </Wait>
  ) : (
    <LoginSwitch setLoaded={setLoaded} promise={paths[location.pathname].promise(history, params)}/>
>>>>>>> 4e53525e4868c5a32988521dd76f2e7d34a4a0ea
  );


  const pageStyle = {}
  if(loaded && user){
<<<<<<< HEAD
    if(options.addNav){
      pageStyle.marginTop = "3em";
    }
    if(options.addBottom){
=======
    if(paths[location.pathname].addNav){
      pageStyle.marginTop = "3em";
    }
    if(paths[location.pathname].addBottom){
>>>>>>> 4e53525e4868c5a32988521dd76f2e7d34a4a0ea
      pageStyle.marginBottom = "3em";
    }
  }


  return <>
<<<<<<< HEAD
    {loaded && user && options.addNav ? <Navbar/> : null}
=======
    {loaded && user && paths[location.pathname].addNav ? <Navbar/> : null}
>>>>>>> 4e53525e4868c5a32988521dd76f2e7d34a4a0ea
    <BackgroundTransition darkMode={isDarkTheme} className={"transition-div"} childFactory={childFactoryCreator(location.state?.animation || "swap-right")}>
      <CSSTransition
        timeout={250}
        classNames={location.state?.animation || "swap-right"}
        key={!loaded ? "Not-loaded" : user ? location.key : "user"}
      ><Page style={pageStyle}>{route}</Page>
      </CSSTransition>
    </BackgroundTransition>
<<<<<<< HEAD
    {loaded && user && options.addBottom ? <BottomNavigator/> : null}
=======
    {loaded && user && paths[location.pathname].addBottom ? <BottomNavigator/> : null}
>>>>>>> 4e53525e4868c5a32988521dd76f2e7d34a4a0ea
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