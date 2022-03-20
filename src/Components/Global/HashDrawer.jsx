
import { Drawer } from '@mui/material';
import { closeDrawer, UIStore } from '../../Config/UIStore';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { List } from '@mui/material';
import { ListSubheader } from '@mui/material';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const HashDrawer = () => {
  const { open, children, anchor, tag } = UIStore.useState(s => s.drawer);
  const history = useHistory();
  const location = useLocation();


  useEffect(() => {
    if(open) {
      history.push(`#${tag}`)
      return history.listen(() => {
        handleClose();
      })
    }
  }, [ open ]);


  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeDrawer();
    history.replace("#");
  };

  return <Drawer
    anchor={anchor}
    open={open}
    onClose={handleClose}
    PaperProps={{sx:{ maxHeight:"90vh", minHeight:"40vh" }}}
  >
    {children}
  </Drawer>
}

export const DrawerList = ({children, header}) => {
  
  return <List sx={{paddingTop:"0"}}>
  <ListSubheader sx={{paddingTop: "0.5em",display:"flex", boxShadow:"#285a84 0px 2px 2px -2px"}}>
      {header}
      <IconButton onClick={closeDrawer} sx={{marginLeft:"auto"}}>
          <Close/>
      </IconButton>
  </ListSubheader>
  {children}
</List>
}


export default HashDrawer;
