
import { Card, CardContent, Container, Typography, List, Collapse } from '@mui/material';
import { MainStore } from './../Config/MainStore';
import CreateList from '../Components/CreateList';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Share, ExpandLess, ExpandMore } from '@mui/icons-material';
import { reduceUsersToDrinks } from '../Config/Helpers';
import { mapDrinksToNumber } from './../Config/Helpers';
import { useState, Fragment } from "react";
import Graph from './../Components/Statistics/Graph';

const MyLists = () => {
    const { lists } = MainStore.useState(s => s);
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
                    {lists?.owned?.map((list, index) => <Fragment key={list._id}><ListItemButton
                        key={list._id}
                        onClick={() => toggle(index)}
                    >
                        <ListItemText
                            primary={list.name}
                            secondary={`Totaal: ${mapDrinksToNumber(reduceUsersToDrinks([list.users]))}`}
                        />
                        <IconButton onClick={() => share(list.shareId)} edge="end" sx={{marginRight:"0.1em"}} aria-label="share">
                            <Share />
                        </IconButton>
                        {isOpen(index) ? <ExpandLess fontSize="medium" /> : <ExpandMore fontSize="medium" />}
                    </ListItemButton>
                        <Collapse in={isOpen(index)} timeout="auto" unmountOnExit>
                            <Graph data={reduceUsersToDrinks([list.users])}></Graph>
                        </Collapse>
                    </Fragment>
                    )}
                </List>
            </CardContent>
        </Card>
    </Container>
}


export default MyLists;