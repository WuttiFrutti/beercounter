
import { Container } from "@mui/material";
import styled from "styled-components";
import { Box } from '@mui/system';


const Logo = styled.img({
    maxWidth: "80vw",
    maxHeight: "200px",
    objectFit: "contain",
    margin: "auto",
    marginTop: "2em",
    marginBottom: "2em"
})



const IconPage = ({ children }) => {

    return <>
        <Container maxWidth="sm">
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "Center" }}>
                <Logo src="/assets/logo.svg" />
            </Box>
        </Container>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "Center" }}>
            {children}
        </Box>
    </>


}

export default IconPage;