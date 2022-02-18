import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import BeerList from './Statistics/BeerList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const UserList = ({ list, favorite, setFavorite }) => {



    return <Card sx={{ marginBottom: "2em" }} key={list._id}><CardContent>
    <Stack direction="row">
        <Typography color="primary" gutterBottom variant="h5" component="div">
            {list.name}
        </Typography>
        <IconButton sx={{marginLeft:"auto"}} onClick={() => setFavorite(list._id)}>
           { favorite === list._id ? <FavoriteIcon/> : <FavoriteBorderIcon /> }
        </IconButton>
    </Stack>
    <BeerList list={list} />
</CardContent></Card>
}


export default UserList;