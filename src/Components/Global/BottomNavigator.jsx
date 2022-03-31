import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import { List as ListIcon } from '@mui/icons-material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const BottomNavigator = ({ state, paths }) => {

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

        }}
    >
        <BottomNavigationAction label="Mijn lijsten" icon={<ListIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Lijsten Beheren" icon={<PlaylistAddIcon />} />
    </BottomNavigation>

}


export default BottomNavigator;