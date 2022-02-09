
import { Typography, List, Divider, Collapse, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import Graph from './Graph';
import { getDrinks, MainStore } from './../../Config/MainStore';
import { Box } from '@mui/system';
import AddDrink from './AddDrink';
import { fillListUser } from '../../Config/Helpers';


const BeerList = ({ list }) => {
    const [opened, setOpened] = useState([]);
    const user = MainStore.useState(s => s.user);
    const userData = MainStore.useState(s => s.users);


    const isOpen = (id) => opened.find(open => open === id) !== undefined;
    const toggle = (id) => {
        if (isOpen(id)) {
            setOpened([...opened].filter(open => open !== id));
        } else {
            setOpened([...opened, id]);
        }
    }

    const users = [...list.users];
    const [userInList] = users.splice(users.findIndex(u => u.user === user._id),1);

    return <>
        <List>
            {
                users.map((user, index) => <BeerListItem listId={list._id}  key={user._id} user={fillListUser(user, userData)} index={index} toggle={toggle} isOpen={isOpen} />)
            }
            <Divider sx={{ marginTop: "1em" }} component="li" />
            <BeerListItem listId={list._id} user={fillListUser(userInList, userData)} index={users.length} toggle={toggle} isOpen={isOpen} />
        </List>
        <Box>
            <AddDrink listId={list._id} listname={list.name}/>
        </Box>
    </>
}

const BeerListItem = ({ user, listId, toggle, isOpen, index }) => {
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
                            {user.total}
                        </Typography>
                    </>
                }
            />
            {isOpen(index) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isOpen(index)} timeout="auto" unmountOnExit>
            <BeerListItemGraph listId={listId} userId={user.user._id} />
        </Collapse>
        <Divider variant="inset" component="li" />
    </>
}

const BeerListItemGraph = ({ listId, userId }) => {
    const drinks = MainStore.useState(getDrinks(listId, userId));

    return <Graph data={drinks}></Graph>
}


export default BeerList;