import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLocation, useHistory } from 'react-router-dom';
import { useState, useEffect } from "react";
import { List as ListIcon} from '@mui/icons-material';

const buttonMap = [
    "/yeet",
    "/",
    "/mijn-lijsten"
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
        <BottomNavigationAction label="Favorieten" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Mijn Lijsten" icon={<ListIcon />} />
    </BottomNavigation>

}


export default BottomNavigator;