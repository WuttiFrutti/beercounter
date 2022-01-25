import { BrowserRouter } from 'react-router-dom';
import Router from "./Config/Router"
import { light, dark } from "./Config/Theme"
import { ThemeProvider } from '@mui/system';
import Snack from './Components/Global/Snack';
import { MainStore } from './Config/MainStore';

function App() {
  const darkmode = MainStore.useState(s => s.darkmode);

  return (
    <ThemeProvider theme={darkmode ? dark : light}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <Snack />
    </ThemeProvider>
  );
}

export default App;
