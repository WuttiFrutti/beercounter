import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';
import { closeSnack, UIStore } from './../../Config/UIStore';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snack = () => {
  const { open, autohide = 2000, children, onClose = () => { }, isAlert = true, args = {}, severity } = UIStore.useState(s => s.snack);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnack();
    onClose();
  };

  return (
    <Snackbar {...args} onClose={handleClose} open={open} autoHideDuration={autohide} >
      {isAlert ?<Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {children}
      </Alert> : children}
    </Snackbar>
  );
}

export default Snack;