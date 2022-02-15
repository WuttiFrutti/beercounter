
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { MainStore } from './../Config/MainStore';
import { Stack } from '@mui/material';
import { useHistory } from 'react-router-dom';
import UserList from './../Components/UserList';
import Wait from './Wait';

const MyLists = () => {
    const lists = MainStore.useState(s => s.lists);
    const history = useHistory();

    return lists === undefined ? null : <>
        <Container sx={{ marginTop: "2em" }} maxWidth="sm">
            {lists === undefined ? null : lists.length === 0 ? <Card><CardContent>
                <Typography color="primary" gutterBottom variant="h5" component="div">
                    Lijsten
                </Typography>
                <Typography color="primary" variant="body2">
                    Je hebt nog geen lijsten. Maak er een aan of doe mee met de lijst van iemand anders.
                </Typography>
                <Stack direction="row" sx={{ marginTop: "2em" }} spacing={1} justifyContent="end" alignItems="center">
                    <Button onClick={() => history.push("lijsten-beheren", { animation: "swap-left" })} color="primary" variant='outlined'>Maak zelf een lijst aan</Button>
                </Stack>
            </CardContent></Card> : <>
                {lists !== undefined ? lists.map(list => <UserList list={list} />) : <Wait />}
            </>}
        </Container>
    </>
}

export default MyLists;