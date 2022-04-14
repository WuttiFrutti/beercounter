
import { Typography, Container, Card, Button, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Profile = () => {
    const history = useHistory();

    const back = () => {
        history.push("/home")
    }

    return <Box sx={{ m: 4, }}>
        <Container maxWidth="sm">
            <Card sx={{ width: "100%", display: "flex" }}>
                <Box sx={{ p: 4 }}>
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
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Button onClick={back} variant="text">Terug</Button>
                </Box>
            </Card>
        </Container>
    </Box>
}



export default Profile;