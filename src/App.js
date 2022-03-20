import { Router as BrowserRouter } from 'react-router-dom';
import Router from "./Config/Router"
import { light, dark } from "./Config/Theme"
import { ThemeProvider } from '@mui/system';
import Snack from './Components/Global/Snack';
import { MainStore } from './Config/MainStore';
import { useEffect } from 'react';
import history from './Config/history';
import HashDrawer from './Components/Global/HashDrawer';
import Modal from './Components/Global/Modal';

function App() {
  const darkmode = MainStore.useState(s => s.darkmode);

  useEffect(() => {
    document.querySelector("meta[name='theme-color']").setAttribute("content", darkmode ? "#272727" : "#FFFFFF");
  },[darkmode])

  return (
    <ThemeProvider theme={darkmode ? dark : light}>
        <BrowserRouter history={history}>
          <Router />
          <HashDrawer />
          <Snack />
          <Modal />
        </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
