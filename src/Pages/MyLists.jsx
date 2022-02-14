
import { Button, Card, CardContent, Container, IconButton, Typography } from '@mui/material';
import { MainStore } from './../Config/MainStore';
import { Stack } from '@mui/material';
import BeerList from '../Components/Statistics/BeerList';
import { useHistory } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useCookie from 'react-use-cookie';

const MyLists = () => {
    const lists = MainStore.useState(s => s.lists);
    const [favorite, setFavorite] = useCookie("favorite-list","");
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
                {lists !== undefined ? lists.map(list => <Card sx={{ marginBottom: "2em" }} key={list._id}><CardContent>
                    <Stack direction="row">
                        <Typography color="primary" gutterBottom variant="h5" component="div">
                            {list.name}
                        </Typography>
                        <IconButton onClick={() => setFavorite(list._id)}>
                           { favorite === list._id ? <FavoriteIcon/> : <FavoriteBorderIcon /> }
                        </IconButton>
                    </Stack>
                    <BeerList list={list} />
                </CardContent></Card>) : null}
            </>

            }


        </Container>
    </>
}

export default MyLists;