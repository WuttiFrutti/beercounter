
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import Graph from '../Components/Statistics/Graph';
import { MainStore } from './../Config/MainStore';
import { Stack } from '@mui/material';
import BeerList from '../Components/Statistics/BeerList';
import { useHistory } from 'react-router-dom';
import useCookie from 'react-use-cookie';
import Wait from './Wait';

const Home = () => {
    const [favorite] = useCookie("favorite-list", "");
    const lists = MainStore.useState(s => s.lists);
    const userDrinks = MainStore.useState(s => s.userDrinks);

    const history = useHistory();
    const favoriteList = lists.find(l => l._id === favorite);
    
    return lists === undefined ? <Wait /> : <>
        <Container sx={{ marginTop: "2em" }} maxWidth="sm">
            <Card sx={{ marginBottom: "2em" }}>
                <CardContent>
                    <Typography color="primary" variant="h5">
                        Statistieken
                    </Typography>
                    <Graph data={userDrinks} />
                </CardContent>
            </Card>
            {favoriteList === undefined ? <Wait /> : lists.length === 0 ? <Card><CardContent>
                <Typography color="primary" gutterBottom variant="h5" component="div">
                    Favorite lijst
                </Typography>
                <Typography color="primary" variant="body2">
                    Je hebt nog geen favoriete lijst ingesteld, ga naar {"mijn lijsten"} om deze in te stellen.
                </Typography>
                <Stack direction="row" sx={{ marginTop: "2em" }} spacing={1} justifyContent="end" alignItems="center">
                    <Button onClick={() => history.push("mijn-lijsten", { animation: "swap-right" })} color="primary" variant='outlined'>Favoriete lijst instellen</Button>
                </Stack>
            </CardContent></Card> : <>
                {favoriteList !== undefined ? <Card sx={{ marginBottom: "2em" }} key={favoriteList._id}><CardContent>
                    <Typography color="primary" gutterBottom variant="h5" component="div">
                        {favoriteList.name}
                    </Typography>
                    <BeerList list={favoriteList} />
                </CardContent></Card> : <Wait />}
            </>
            }


        </Container>
    </>
}


export default Home;