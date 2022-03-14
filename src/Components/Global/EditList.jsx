import { Modal, Box, Typography } from "@mui/material";
import ModalFade from './ModalFade';



const EditList = ({ setOpen, open }) => {
    const close = () => {
        setOpen(false);
    }

    return <ModalFade open={open} handleClose={close}>
        <div style={{marginBottom:"70vh"}}>
            
        </div>
    </ModalFade>
}


export default EditList;