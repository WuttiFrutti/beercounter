
import IconPage from './IconPage';
import { Typography, Container } from '@mui/material';


const NotFound = () => {

    return <IconPage>
        <Container maxSize="sm">
            <Typography sx={{textAlign:"center"}} variant="h1" color="primary" component="h2">
                Pagina Bestaat Niet!
            </Typography>
        </Container>
    </IconPage>
}



export default NotFound;