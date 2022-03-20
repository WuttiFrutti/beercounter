import { Divider, Box, Button, Typography } from "@mui/material";
import { useState } from 'react';
import { closeModal } from './../../Config/UIStore';



const ConfirmationModal = ({ text, cancelAction = () => Promise.resolve(), confirmAction = () => Promise.resolve() }) => {
    const [waiting, setWaiting] = useState(false);

    const cancel = async () => {
        setWaiting(true);
        await cancelAction();
        closeModal();
    }

    const confirm = async () => {
        setWaiting(true);
        await confirmAction();
        closeModal();
    }

    return <>
        <Typography sx={{paddingTop:2, paddingBottom:2}}>
            {text}
        </Typography>
        <Divider />
        <Box sx={{paddingTop:4, display:"flex"}}>
            <Button sx={{marginLeft:"auto"}} disabled={waiting} onClick={cancel} variant="contained">Nee</Button>
            <Button sx={{marginLeft:"1em"}} disabled={waiting} onClick={confirm} variant="contained">Ja</Button>
        </Box>
    </>
}


export default ConfirmationModal;