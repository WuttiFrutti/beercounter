import { Add, Close, Edit } from "@mui/icons-material";
import { Modal, Box, Typography, Drawer, List, ListItem, ListItemText, ListSubheader, IconButton, ListItemButton, ListItemIcon } from "@mui/material";
import { fillListUser } from "../../Config/Helpers";
import { getDrinks, MainStore } from "../../Config/MainStore";
import HashDrawer, { DrawerList } from './HashDrawer';
import { closeDrawer, openDrawer, openModal } from './../../Config/UIStore';
import moment from 'moment';
import { removeDrink, retrieveDrinksForListUser } from './../../Config/Axios';
import ConfirmationModal from "./ConfirmationModal";
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const EditList = ({ listId }) => {
    const list = MainStore.useState(s => s.lists.find(l => l._id === listId));
    const users = MainStore.useState(s => s.users);

    const swapDrawer = (user) => {
        closeDrawer();
        setTimeout(() => openDrawer(<EditUser user={user} listId={listId} />), 100)
    }

    const generateList = list?.users.map(u => {
        u = fillListUser(u, users);
        return <>
            <ListItem key={u.user}>
                <ListItemText primary={u.user.username} secondary={`Totaal: ${u.total}`} />
                <IconButton onClick={() => swapDrawer(u)} edge="end">
                    <Edit />
                </IconButton>
            </ListItem>
        </>
    })

    return <div>
        <DrawerList header="Gebruikers">
            {generateList}
        </DrawerList>
    </div>
}

const EditUser = ({ user, listId }) => {
    const drinks = MainStore.useState(getDrinks(listId, user.user._id));

    const openDrinkModal = (drink) => {
        openModal(<EditDrinkModal drink={drink} />, "Aanpassen")
    }

    const openRemoveModal = (drink) => {
        openModal(<RemoveDrinkModal drink={drink} />, "Verwijderen")
    }

    const openCreateModal = () => {
        openModal(<CreateDrinkModal />, "Aanmaken")
    }

    const drinkList = drinks?.map(d => <ListItem key={d._id}>
        <ListItemIcon>
        <FontAwesomeIcon  size="2xl" icon={faBeerMugEmpty} />
        </ListItemIcon>
        <ListItemText primary={moment(d.updatedAt).format('hh:mm D/M/YYYY')} secondary={`Aantal: ${d.amount}`} />
        <IconButton onClick={() => openRemoveModal(d)} edge="end">
            <Close />
        </IconButton>
        <IconButton onClick={() => openDrinkModal(d)} edge="end">
            <Edit />
        </IconButton>
    </ListItem>
    )

    return <DrawerList header={user.user.username}>
        {drinks?.length > 0 ? 
        <>
            {drinkList}
        </> : 
        <>
            <Box sx={{p:4}}>
                <Typography variant="h6" component="h2">
                    Er is geen data gevonden.
                </Typography>
            </Box>
        </>}
        <ListItemButton onClick={openCreateModal}>
                <ListItemText primary="Nieuw item aanmaken" />
                <IconButton edge="end">
                    <Add />
                </IconButton>
        </ListItemButton>
    </DrawerList>
}


const RemoveDrinkModal = ({ drink }) => {
    const confirm = () => removeDrink(drink.list, drink);

    return <ConfirmationModal text="Weet je zeker dat je item wilt verwijderen?" confirmAction={confirm} />
}

const EditDrinkModal = ({ drink }) => {

    return null
}

const CreateDrinkModal = () => {

    return null;
}


export default EditList;