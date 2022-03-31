import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MUIModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { closeModal, UIStore } from './../../Config/UIStore';
import { Card, Container } from '@mui/material';

const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const cardStyle = {
    minHeight: "100px",
    p: 4
};

const Modal = () => {
    const { open = false, children, title } = UIStore.useState(s => s.modal);


    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        closeModal();
    };

    return (
        <MUIModal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Container sx={containerStyle}>
                    <Card sx={cardStyle}>
                        <Typography variant="h6" component="h2">
                            {title}
                        </Typography>
                        {children}
                    </Card>
                </Container>
            </Fade>
        </MUIModal>
    );
}

export default Modal;