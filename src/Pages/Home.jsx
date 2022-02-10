
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import Graph from '../Components/Statistics/Graph';
import { MainStore } from './../Config/MainStore';
import { Stack } from '@mui/material';
import BeerList from '../Components/Statistics/BeerList';
import { useHistory } from 'react-router-dom';


const Home = () => {
    const lists = MainStore.useState(s => s.lists);
    const userDrinks = MainStore.useState(s => s.userDrinks);

    const history = useHistory();

    return lists === undefined ? null : <>
        <Container sx={{ marginTop: "2em" }} maxWidth="sm">
            <Card sx={{ marginBottom: "2em" }}>
                <CardContent>
                    <Typography color="primary" variant="h5">
                        Statistieken
                    </Typography>
                    <Graph data={userDrinks} />
                </CardContent>
            </Card>

            {lists === undefined ? null : lists.length === 0 ? <Card><CardContent>
                <Typography color="primary" gutterBottom variant="h5" component="div">
                    Lijsten
                </Typography>
                <Typography color="primary" variant="body2">
                    Je hebt nog geen lijsten. Maak er een aan of doe mee met de lijst van iemand anders.
                </Typography>
                <Stack direction="row" sx={{ marginTop: "2em" }} spacing={1} justifyContent="end" alignItems="center">
                    <Button onClick={() => history.push("mijn-lijsten", { animation:"swap-left" })} color="primary" variant='outlined'>Maak zelf een lijst aan</Button>
                </Stack>
            </CardContent></Card> : <>
                {lists !== undefined ? lists.map(list => <Card sx={{marginBottom:"2em"}} key={list._id}><CardContent>
                    <Typography color="primary" gutterBottom variant="h5" component="div">
                        {list.name}
                    </Typography>
                    <BeerList list={list} />
                    </CardContent></Card>) : null}
            </>

            }


        </Container>
    </>
}


export default Home;