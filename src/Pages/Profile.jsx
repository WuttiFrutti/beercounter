
import { Typography, Container, Card, Button, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListSubheader, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import { MainStore } from '../Config/MainStore';
import { retrieveEndedLists, retrieveLatestTag } from '../Config/Axios';
import { ListItemText } from '@mui/material';
import { setDarkMode } from './../Config/MainStore';
import { LightMode } from '@mui/icons-material';
import { Logo } from './../Components/Global/Logo';
import ConfirmationModal from './../Components/Global/ConfirmationModal';
import { openModal } from "../Config/UIStore";
import { removeList } from './../Config/Axios';
import styled from 'styled-components';

const Emblem = styled.img`
    right: 12%;
    max-width: 100px;
    position: absolute;
    bottom: 4%;
`

const Profile = () => {
    const history = useHistory();
    const endedLists = MainStore.useState(s => s.ended);
    const version = MainStore.useState(s => s.version);



    const back = () => {
        history.push("/home")
    }

    return <Box sx={{ m: 4, }}>
        <Container maxWidth="sm">
            <Card sx={{ width: "100%", display: "flex" }}>
                <Box sx={{ p: 4, width: "100%", }}>
                    <Box sx={{ position: "relative" }}>
                        <Logo width="100%" height="100%" src="/assets/logo.svg" alt="Chef Bier" />
                        <Box sx={{
                            position: "relative",
                            bottom: "2em",
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Typography sx={{
                                left: "-10%",
                                marginLeft: "-40%",
                            }}>
                                Powered By:<br />
                                {version}</Typography>
                            <Emblem src="/assets/stam_emblem.svg" alt="Stam Emblem" />
                        </Box>  
                    </Box>
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
                            {endedLists && endedLists.map(list => <Accordion key={list._id}>
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
    const openRemove = () => openModal(<ConfirmationModal text="Weet je zeker dat je deze lijst wilt verwijderen? Dit verwijderd ook alle statistieken voor de deelnemers!" confirmAction={() => removeList(list._id)} />, "Bevestigen")

    return <>
        <List sx={{ padding: 0 }}>
            {list.users.map(user => <ListItem key={user._id} sx={{ padding: 0 }}>
                <ListItemText
                    sx={{ padding: 0 }}
                    primary={user.user.username}
                    secondary={<>
                        Drankjes: {user.total}<br />
                        Prijs: €{((user.total * list.price) / 100).toFixed(2)}

                    </>}
                />
            </ListItem>)}
        </List>
        <Button variant="contained" onClick={openRemove}>Verwijderen</Button>
    </>

}


export default Profile;