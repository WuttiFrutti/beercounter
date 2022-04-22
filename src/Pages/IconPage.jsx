
import { Container } from "@mui/material";
import { Box } from '@mui/system';
import { Logo } from './../Components/Global/Logo';






const IconPage = ({ children }) => {

    return <>
        <Container maxWidth="sm">
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "Center" }}>
                <Logo width="100%" height="100%" src="/assets/logo.svg" alt="Chef Bier" />
            </Box>
        </Container>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "Center" }}>
            {children}
        </Box>
    </>


}

export default IconPage;