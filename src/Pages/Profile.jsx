
import { Typography, Box, Card, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';


const Profile = () => {
    const history = useHistory();

    const back = () => {
        history.push("/")
    }

    return <Box sx={{ height: "100vh", width: "100vw", position: "absolute", display: "flex" }}>
        <Card sx={{ m: 4, width: "100%", p: 4, display:"flex" }}>
            <Typography variant="h6" component="h2">
                Profiel
            </Typography>

            <Button onClick={back} variant="text" sx={{marginTop:"auto", marginLeft:"auto"}}>Terug</Button>
        </Card>
    </Box>
}



export default Profile;