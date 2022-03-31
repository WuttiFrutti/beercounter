import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import { List as ListIcon } from '@mui/icons-material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useHistory } from 'react-router-dom';

const BottomNavigator = ({ state, paths }) => {
    const history = useHistory();

    return <BottomNavigation
        sx={{
            position: "fixed",
            width: "100vw",
            bottom: "0",
            zIndex: "10",
            boxShadow: "#285a84 0px 0px 2px",
            left: "0"
        }}
        showLabels
        value={state}
        onChange={(e, val) => {
            if(val !== state){
                history.push(paths[val].path);
            }
        }}
    >
        <BottomNavigationAction label="Mijn lijsten" icon={<ListIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Lijsten Beheren" icon={<PlaylistAddIcon />} />
    </BottomNavigation>

}


export default BottomNavigator;