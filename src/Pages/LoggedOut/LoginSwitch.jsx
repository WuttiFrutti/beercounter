import IconPage from '../IconPage';

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { cloneElement, useState } from 'react';
import PreLoading from './PreLoading';
import { Container } from '@mui/material';
import { Box } from '@mui/system';
import React, { Suspense } from 'react';
import Wait from './../Wait';

const Login = React.lazy(() => import('./Login'));
const Register = React.lazy(() => import('./Register'));

const LoginSwitch = ({ deferLoading, setUser }) => {
  const [state, setState] = useState("loading");
  const [animation, setAnimation] = useState("swap-right");

  const swap = (state, animation) => {
    document.querySelector("#main-page").scrollTo({ top: 0, behavior: 'smooth' });
    setAnimation(animation);
    setState(state);
  }

  const stateComponents = {
    loading: <PreLoading swap={swap} setUser={setUser} deferLoading={deferLoading} />,
    login: <Wait><Login swap={swap} /></Wait>,
    register: <Wait><Register swap={swap} /></Wait>
  }

  return <IconPage><TransitionGroup className="child-transition-div" childFactory={childFactoryCreator(animation)}>
    <CSSTransition
      timeout={250}
      classNames={animation}
      key={state}
    >
      <Box sx={{ minWidth: "100vw", paddingBottom: "1em" }}><Container maxWidth="sm">{stateComponents[state]}</Container></Box>
    </CSSTransition>
  </TransitionGroup></IconPage>;

}

const childFactoryCreator = (classNames) => (
  (child) => (
    cloneElement(child, {
      classNames
    })
  )
);

export default LoginSwitch;