import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useHistory } from 'react-router-dom';
import { useState, useEffect } from "react";
import { List as ListIcon} from '@mui/icons-material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const buttonMap = [
    "/mijn-lijsten",
    "/",
    "/lijsten-beheren"
]

const BottomNavigator = () => {
    const location = useLocation();
    const history = useHistory();
    const [state, setState] = useState(1)

    useEffect(() => {
        setState(buttonMap.findIndex(s => s === location.pathname))
    },[setState,location])


    return <BottomNavigation
        sx={{
            position: "fixed",
            width: "100vw",
            bottom: "0",
            zIndex:"10"
        }}
        showLabels
        value={state}
        onChange={(e, val) => {
            if (val !== state) {
                setState(val);
                history.push(buttonMap[val], { animation: val > state ? "swap-left" : "swap-right" })
            }
        }}
    >
        <BottomNavigationAction label="Mijn lijsten" icon={<ListIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Lijsten Beheren" icon={<PlaylistAddIcon />} />
    </BottomNavigation>

}


export default BottomNavigator;