
import { Card, CardContent, ButtonGroup, Container, Typography, List, Collapse, Button, Stack } from '@mui/material';
import { getDrinks, MainStore } from '../Config/MainStore';
import CreateList from '../Components/CreateList';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Share, ExpandLess, ExpandMore, NotificationImportant as Notify, Edit } from '@mui/icons-material';
import { useState, Fragment } from "react";
import Graph from '../Components/Statistics/Graph';
import { notifyList, removeList } from "../Config/Axios";
import EditList from './../Components/Global/EditList';
import { openDrawer, openModal } from './../Config/UIStore';
import ConfirmationModal from './../Components/Global/ConfirmationModal';
import { endList } from './../Config/Axios';

const ManageLists = () => {
    const lists = MainStore.useState(s => s.lists);
    const user = MainStore.useState(s => s.user);
    const owned = lists.filter(l => l.owner === user._id);

    const [opened, setOpened] = useState([]);

    const isOpen = (id) => opened.find(open => open === id) !== undefined;
    const toggle = (id) => {
        if (isOpen(id)) {
            setOpened([...opened].filter(open => open !== id));
        } else {
            setOpened([...opened, id]);
        }
    }

    const share = (id) => {
        const data = {
            title: "Chef Bier - Lijst",
            text: "Doe mee aan deze lijst!",
            url: window.location.origin + "/join/" + id
        }

        navigator.share(data)
    }

    const openNotificationModal = (id) => openModal(<ConfirmationModal text="Weet je zeker dat je iedereen een notificatie wil sturen?" confirmAction={() => notifyList(id)} />, "Notificatie")

    return <Container sx={{ marginTop: "2em" }} maxWidth="sm">
        <Card sx={{ marginBottom: "2em" }}>
            <CardContent>
                <Typography color="primary" variant="h5">
                    Mijn Lijsten
                </Typography>
                <Typography variant="subtitle1">
                    Hier staan de lijsten die beheerd worden door jou.
                </Typography>
                <List>
                    <CreateList />
                    {owned?.map((list, index) => <Fragment key={list._id}><ListItemButton
                        key={list._id}
                    >
                        <ListItemText
                            primary={list.name}
                            secondary={`Totaal: ${list.total}`}
                        />
                        <IconButton onClick={() => openDrawer(<EditList listId={list._id} />)} edge="end" sx={{ marginRight: "0.1em" }} aria-label="edit">
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => openNotificationModal(list._id)} edge="end" sx={{ marginRight: "0.1em" }} aria-label="notify">
                            <Notify />
                        </IconButton>
                        <IconButton onClick={() => share(list.shareId)} edge="end" sx={{ marginRight: "0.1em" }} aria-label="share">
                            <Share />
                        </IconButton>
                        <IconButton onClick={() => toggle(index)}>
                            {isOpen(index) ? <ExpandLess fontSize="medium" /> : <ExpandMore fontSize="medium" />}
                        </IconButton>
                    </ListItemButton>
                        <Collapse in={isOpen(index)} timeout="auto" unmountOnExit>
                            <ManageListItemGraph listId={list._id} />
                        </Collapse>
                    </Fragment>
                    )}
                </List>
            </CardContent>
        </Card>
    </Container>
}

const ManageListItemGraph = ({ listId }) => {
    const drinks = MainStore.useState(getDrinks(listId));


    const openEnd = () => openModal(<ConfirmationModal text="Weet je zeker dat je deze lijst wilt beëindigen?" confirmAction={() => endList(listId)} />, "Bevestigen")

    const openRemove = () => openModal(<ConfirmationModal text="Weet je zeker dat je deze lijst wilt verwijderen?" confirmAction={removeList} />, "Bevestigen")

    return <>
        <Graph data={drinks} ></Graph>
        <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"
            direction="row"
        >
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={openEnd}>Beëindigen</Button>
                <Button onClick={openRemove}>Verwijderen</Button>
            </ButtonGroup>
        </Stack>
    </>
}

export default ManageLists;