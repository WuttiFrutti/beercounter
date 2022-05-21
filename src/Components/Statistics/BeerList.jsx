
import { Typography, Accordion, AccordionSummary, AccordionDetails, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Graph from './Graph';
import { getDrinks, MainStore } from './../../Config/MainStore';
import { Box } from '@mui/system';
import AddDrink from './AddDrink';
import { fillListUser } from '../../Config/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'


const BeerList = ({ list }) => {
    const user = MainStore.useState(s => s.user);
    const userData = MainStore.useState(s => s.users);



    const users = [...list.users].sort((a, b) => a.total - b.total)
    const highestNumber = users[users.length - 1].total;
    const [userInList] = users.splice(users.findIndex(u => u.user === user._id), 1);

    return <>
        <Typography variant="subtitle2" sx={{ marginBottom: "1em" }}>
            Totaal: {list.total} <br />
            Prijs: €{((list.total * list.price) / 100).toFixed(2)}
        </Typography>
        {
           users.map((user, index) => <BeerListItem price={list.price} listId={list._id} key={user._id} highest={highestNumber} user={fillListUser(user, userData)} index={index} />)
        }
        <BeerListItem price={list.price} listId={list._id} highest={highestNumber} user={fillListUser(userInList, userData)} index={users.length} />
        <Box>
            <AddDrink listId={list._id} listname={list.name} />
        </Box>
    </>
}

const BeerListItem = ({ user, listId, index, highest, price }) => {
    return <>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                <ListItemAvatar sx={{ minWidth: 0, marginRight: "1em" }}>
                    {user.total <= 0 ? null : user.total >= highest ? <FontAwesomeIcon size="lg" icon={faCrown} style={{ color: "gold", position: "relative", left: "50%", transform: "translate(-50%,30%)", zIndex: 1 }} /> : null}
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
                            <br />
                            {"Prijs: "}
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                €{((user.total * price) / 100).toFixed(2)}
                            </Typography>
                        </>
                    }
                />
            </AccordionSummary>
            <AccordionDetails>
                <BeerListItemGraph listId={listId} userId={user.user._id} />
            </AccordionDetails>
        </Accordion>
    </>
}

const BeerListItemGraph = ({ listId, userId }) => {
    const drinks = MainStore.useState(getDrinks(listId, userId));

    return <Graph data={drinks}></Graph>
}


export default BeerList;
