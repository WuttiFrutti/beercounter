import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addDrink, removeDrink } from './../../Config/Axios';
import { Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import { closeSnack, openSnack } from './../../Config/UIStore';
import Confetti from 'react-dom-confetti';

const AddDrink = ({ listId, listname }) => {
    const [amount, setAmount] = React.useState(1);
    const [sending, setSending] = React.useState(false);
    const [success, setSuccess] = React.useState(false)

    const numberSelect = (max = 10) => {
        const arr = [];
        for (let i = 1; i <= max; i++) {
            arr.push(<MenuItem key={i} value={i}>{i}</MenuItem>)
        }
        return arr;
    }


    const undo = (data) => {
        closeSnack();
        setSending(true);
        removeDrink(listId, data).then(() => {
            setSending(false);
        }).catch(() => {
            setSending(false);
        });
    }


    const submit = (e) => {
        e.preventDefault()
        setSending(true);
        addDrink(listId, amount).then((data) => {
            setSuccess(true);
            openSnack(null, null, {
                autohide: 5000, isAlert: false, args: { message: `${amount} drankjes toegevoegd aan ${listname}.`, action: <Action close={closeSnack} undo={() => undo(data)} /> }
            });
            setSending(false);
            setSuccess(false)
        }).catch(() => {
            setSending(false);
        });

    }

    const config = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 700,
        dragFriction: 0.10,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };


    return (
        <Box component="form" onSubmit={submit} sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
            <FormControl disabled={sending} sx={{ minWidth: 120 }}>
                <InputLabel id="amount-label">Aantal</InputLabel>
                <Select
                    labelId="amount-label"
                    value={amount}
                    label="Aantal"
                    onChange={(e) => setAmount(e.target.value)}
                >
                    {numberSelect()}
                </Select>
            </FormControl>
            <Box sx={{ display: "flex", marginLeft: "1em" }}>
                <Confetti active={success} config={config} />
                <IconButton onClick={submit} disabled={sending} sx={{ margin: "auto" }}>
                    <AddIcon size="large" fontSize="large" color="primary" />
                </IconButton>
            </Box>
        </Box>
    );
}


const Action = ({ close, undo }) => (
    <React.Fragment>
        <Button color="secondary" size="small" onClick={undo}>
            Ongedaan maken
        </Button>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={close}
        >
            <Close fontSize="small" />
        </IconButton>
    </React.Fragment>
);

export default AddDrink
