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
    component: <Join />,
    promise: (history, params) => {
      joinList(params.shareId).then(() => {
        history.push("/");
        MainStore.update(s => ({ ...s ,snack:{ open:true, severity:"info", children:<>Je doet nu mee aan de lijst!</> }  }));
      }).catch(() => {
        history.push("/");
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
  const params = useParams();
  const switchRef = React.useRef();

  const [loaded, setLoaded] = React.useState(false)
  const user = MainStore.useState(s => s.user);

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
  );


  const pageStyle = {}
  if(loaded && user){
    if(paths[location.pathname].addNav){
      pageStyle.marginTop = "3em";
    }
    if(paths[location.pathname].addBottom){
      pageStyle.marginBottom = "3em";
    }
  }


  return <>
    {loaded && user && paths[location.pathname].addNav ? <Navbar/> : null}
    <BackgroundTransition darkMode={isDarkTheme} className={"transition-div"} childFactory={childFactoryCreator(location.state?.animation || "swap-right")}>
      <CSSTransition
        timeout={250}
        classNames={location.state?.animation || "swap-right"}
        key={!loaded ? "Not-loaded" : user ? location.key : "user"}
      ><Page style={pageStyle}>{route}</Page>
      </CSSTransition>
    </BackgroundTransition>
    {loaded && user && paths[location.pathname].addBottom ? <BottomNavigator/> : null}
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