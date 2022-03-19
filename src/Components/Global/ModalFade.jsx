import { Modal, Card, Fade } from '@mui/material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:400, 
    p: 4,
  };

const ModalFade = (args) => {
    return <Modal
    open={args.open}
    onClose={args.handleClose}
    {...args.modalArgs}
  >
    <Fade in={args.open}>
      <Card sx={style}>
        {args.children}
      </Card>
    </Fade>
  </Modal>
}


export default ModalFade;
