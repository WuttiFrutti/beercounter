import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Toolbar, IconButton } from '@mui/material';
import { useTheme } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { logout } from '../../Config/Axios';
import { LightMode } from '@mui/icons-material';
import { setDarkMode } from './../../Config/MainStore';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isDarkTheme = useTheme().palette.mode === 'dark';
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };




    return <Box sx={{ flexGrow: 1 }} >
        <AppBar position="static" sx={{ position: "absolute", zIndex: "1" }} color={!isDarkTheme ? "neutral" : "default"}>
            <Toolbar>
                <img src={"/assets/logo-small.svg"} alt="text-logo" width="150px" />
                <Box component="div" sx={{ flexGrow: 1 }} />
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="primary"
                        onClick={() => setDarkMode()}
                    >
                        <LightMode fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="primary"
                    >
                        <AccountCircle fontSize="inherit" />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            handleClose();
                            history.push("/")
                            logout();
                        }}>Uitloggen</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    </Box>
}

export default Navbar;