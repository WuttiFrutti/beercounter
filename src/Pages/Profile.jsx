
import { Typography, Container, Card, Button, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListSubheader } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from "react";
import { MainStore } from '../Config/MainStore';
import { retrieveEndedLists } from '../Config/Axios';
import { ListItemText } from '@mui/material';
import { Divider } from '@mui/material';

const Profile = () => {
    const history = useHistory();
    const endedLists = MainStore.useState(s => s.ended);

    useEffect(() => {
        if (endedLists === false) {
            retrieveEndedLists();
        }
    });

    console.log(endedLists);


    const back = () => {
        history.push("/home")
    }

    return <Box sx={{ m: 4, }}>
        <Container maxWidth="sm">
            <Card sx={{ width: "100%", display: "flex" }}>
                <Box sx={{ p: 4, width: "100%", }}>
                    <Typography variant="h6" component="h2">
                        Profiel
                    </Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Instellingen</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {/* TODO: ADD list settings */}
                                Er is hier momenteel niks te zien!
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Lijsten</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {/* TODO: ADD ended settings */}
                                {endedLists && endedLists.map(list => <EndedList list={list} />)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Notificaties</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {/* TODO:ADD Notification settings */}
                                Er is hier momenteel niks te zien!
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Button onClick={back} variant="text">Terug</Button>
                </Box>
            </Card>
        </Container>
    </Box>
}

const EndedList = ({ list }) => {

    return <>
        <List subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                {list.name}
            </ListSubheader>
        }>

            {list.users.map(user => <>
                <ListItem key={user._id}>
                    <ListItemText
                        primary={user.user.username}
                        secondary={<>
                            Drankjes: {user.total}<br />
                            Prijs: €{((user.total * list.price) / 100).toFixed(2)}

                        </>}
                    />
                </ListItem>
            </>)}

        </List>
        <Divider />
    </>

}


export default Profile;