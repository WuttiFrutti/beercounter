
import { Typography, Container, Card, Button, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListSubheader, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import { MainStore } from '../Config/MainStore';
import { retrieveEndedLists } from '../Config/Axios';
import { ListItemText } from '@mui/material';
import { setDarkMode } from './../Config/MainStore';
import { LightMode } from '@mui/icons-material';


const Profile = () => {
    const history = useHistory();
    const endedLists = MainStore.useState(s => s.ended);

    useEffect(() => {
        if (endedLists === false) {
            retrieveEndedLists();
        }
    });


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
                                Thema: <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="primary"
                        onClick={() => setDarkMode()}
                    >
                        <LightMode fontSize="inherit" />
                    </IconButton>
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
                            {endedLists && endedLists.map(list => <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>{list.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <EndedList list={list} />
                                </AccordionDetails>
                            </Accordion>)}
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
        <List sx={{ padding: 0 }}>
            {list.users.map(user => <>
                <ListItem key={user._id} sx={{ padding: 0 }}>
                    <ListItemText
                        sx={{ padding: 0 }}
                        primary={user.user.username}
                        secondary={<>
                            Drankjes: {user.total}<br />
                            Prijs: €{((user.total * list.price) / 100).toFixed(2)}

                        </>}
                    />
                </ListItem>
            </>)}

        </List>
    </>

}


export default Profile;