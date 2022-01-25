
import { Typography, List, Divider, Collapse, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import Graph from './Graph';
import { MainStore } from './../../Config/MainStore';
import { Box } from '@mui/system';
import AddDrink from './AddDrink';


const BeerList = ({ list }) => {
    const [opened, setOpened] = useState([]);
    const userId = MainStore.useState(s => s.user._id);

    const isOpen = (id) => opened.find(open => open === id) !== undefined;
    const toggle = (id) => {
        if (isOpen(id)) {
            setOpened([...opened].filter(open => open !== id));
        } else {
            setOpened([...opened, id]);
        }
    }

    const users = [...list.users];
    const [userInList] = users.splice(users.findIndex(u => u.user._id === userId),1);

    return <>
        <List>
            {
                users.map((user, index) => <BeerListItem key={user._id} user={user} index={index} toggle={toggle} isOpen={isOpen} />)
            }
            <Divider sx={{ marginTop: "1em" }} component="li" />
            <BeerListItem user={userInList} index={users.length} toggle={toggle} isOpen={isOpen} />
        </List>
        <Box>
            <AddDrink listId={list._id} listname={list.name}/>
        </Box>
    </>
}

const BeerListItem = ({ user, toggle, isOpen, index }) => {

    return <>
        <ListItemButton onClick={() => toggle(index)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={user.user.username} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
                primary={user.user.username}
                secondary={
                    <>
                        {"Drankjes: "}
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {user.drinks.reduce((a, b) => a + b.amount, 0)}
                        </Typography>
                    </>
                }
            />
            {isOpen(index) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isOpen(index)} timeout="auto" unmountOnExit>
            <Graph data={user.drinks}></Graph>
        </Collapse>
        <Divider variant="inset" component="li" />
    </>
}


export default BeerList;