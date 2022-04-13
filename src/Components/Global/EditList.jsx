import { Add, Close, Edit } from "@mui/icons-material";
import { Box, Typography, ListItem, ListItemText, IconButton, ListItemButton, ListItemIcon, TextField, Button } from "@mui/material";
import { fillListUser } from "../../Config/Helpers";
import { getDrinks, MainStore } from "../../Config/MainStore";
import { DrawerList } from './HashDrawer';
import { closeDrawer, openDrawer, openModal } from '../../Config/UIStore';
import moment from 'moment';
import { addDrink, editDrink, removeDrink } from '../../Config/Axios';
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { retrieveDrinksForListUser } from './../../Config/Axios';
import { closeModal } from './../../Config/UIStore';


const EditList = ({ listId }) => {
    const list = MainStore.useState(s => s.lists.find(l => l._id === listId));
    const users = MainStore.useState(s => s.users);

    const swapDrawer = (user) => {
        closeDrawer();
        setTimeout(() => openDrawer(<EditUser user={user} listId={listId} />), 100)
    }

    const generateList = list?.users.map(u => {
        u = fillListUser(u, users);
        return <ListItem key={u.user._id}>
            <ListItemText primary={u.user.username} secondary={`Totaal: ${u.total}`} />
            <IconButton onClick={() => swapDrawer(u)} edge="end">
                <Edit />
            </IconButton>
        </ListItem>
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
        openModal(<CreateDrinkModal user={user} listId={listId} />, "Aanmaken")
    }

    const drinkList = drinks?.map(d => <ListItem key={d._id}>
        <ListItemIcon>
            <FontAwesomeIcon size="2xl" icon={faBeerMugEmpty} />
        </ListItemIcon>
        <ListItemText primary={moment(d.updatedAt).format('HH:mm DD/M/YYYY')} secondary={`Aantal: ${d.amount}`} />
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
                <Box sx={{ p: 4 }}>
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

    const save = async (date, amount) => {
        const data = await editDrink(drink, amount, date);
        closeModal();
        return data;
    };


    return <EditDrink save={save} amount={drink.amount} date={drink.updatedAt} />
}

const CreateDrinkModal = ({ listId, user }) => {

    const save = async (date, amount) => {
        const data = await addDrink(listId, amount, user.user._id, date);
        closeModal();
        return data;
    };

    return <EditDrink save={save} date={new Date()} amount={1} />
}

const EditDrink = ({ amount: propAmount = 0, date: propDate = Date.now(), save: saveMethod = () => Promise.resolve() }) => {
    const [date, setDate] = useState(propDate);
    const [amount, setAmount] = useState(propAmount);
    const [disabled, setDisabled] = useState(false)

    const save = (e) => {
        e.preventDefault()
        if (!disabled) {
            setDisabled(true)
            saveMethod(date, amount).then(() => {
                setDisabled(false);
            }).catch(() => {
                setDisabled(false);
            });
        }
    }

    return <form onSubmit={save}>
        <TextField
            disabled={disabled}
            sx={{ marginTop: "1em" }}
            label="Datum"
            type="datetime-local"
            value={moment(date).format('yyyy-MM-DD[T]HH:mm')}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
        /><br />
        <TextField
            sx={{ marginTop: "1em" }}
            label="Aantal"
            type="number"
            disabled={disabled}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
        /><br />

        <Button disabled={disabled} type="submit">
            Opslaan
        </Button>
    </form>
}




export default EditList;