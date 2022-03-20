import { useState } from "react";
import Collapse from '@mui/material/Collapse';
import { IconButton, Box, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Divider, InputAdornment } from "@mui/material";
import { Add, ExpandLess, ExpandMore, Remove } from "@mui/icons-material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LoadingButton } from '@mui/lab';
import { createList } from './../Config/Axios';
import { AxiosError } from './../Config/Helpers';
import { MainStore } from "../Config/MainStore";
import { openSnack } from "../Config/UIStore";

const defaultFormState = {
    join: true,
    name: "",
    price: "0.50",
    users: [""],
}

const CreateList = () => {
    const [open, setOpen] = useState();
    const [formState, setFormState] = useState(defaultFormState);
    const [errors, setErrors] = useState({
        users: []
    });
    const [sending, setSending] = useState(false);


    const updateForm = (e) => {
        const prop = e.target.attributes.prop.value;
        let val = e.target.value
        if(prop === "price"){
            val = Number.parseFloat(val).toFixed(2);
        } 
        setFormState({ ...formState, [prop]: val });
    }

    const updateUser = (val, index) => {
        const form = { ...formState };
        form.users[index] = val;
        setFormState(form);
    }

    const add = () => {
        const form = { ...formState };
        form.users.push("");
        setFormState(form);
    }

    const remove = (index) => {
        const form = { ...formState };
        form.users.splice(index, 1);
        setFormState(form);
    }

    const submit = (e) => {
        e.preventDefault();
        setSending(true);
        createList(formState.name, formState.price * 100, formState.join, formState.users).then((e) => {
            setSending(false);
            setOpen(false);
            setFormState(defaultFormState);
            openSnack(<>Lijst aangemaakt!</>,"info");
        }).catch((e) => {
            setSending(false)
            if (e instanceof AxiosError) {
                setErrors(e.response.data);
            } else {
                throw e;
            }
        })
    }

    return <>
        <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText primary="Nieuwe Lijst aanmaken" />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Box component="form" sx={{
                display: "flex",
                flexDirection: "column",
                '& .MuiFormControl-root': { m: 1 }
            }} onSubmit={submit}>
                <TextField
                    disabled={sending}
                    inputProps={{ prop: 'name' }}
                    error={errors.name !== undefined}
                    onChange={updateForm}
                    value={formState.name}
                    label="Naam"
                    helperText={errors.name}
                    variant="filled"
                />
                <TextField
                    disabled={sending}
                    inputProps={{ prop: 'price' }}
                    error={errors.price !== undefined}
                    type="number"
                    onChange={updateForm}
                    value={formState.price}
                    label="Prijs per drankje"
                    helperText={errors.price}
                    variant="filled"
                />
                <Typography sx={{ marginTop: "1em" }} variant="subtitle1">
                    Gebruikers om uit te nodigen
                </Typography>
                <Divider />
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    '& .MuiFormControl-root': { m: 1 }
                }}>
                    {formState.users.map((u, index) => <TextField
                        key={index}
                        disabled={sending}
                        InputProps={{
                            inputMode: 'email',
                            endAdornment: index !== 0 ? <InputAdornment position="end">
                                <IconButton onClick={() => remove(index)}>
                                    <Remove />
                                </IconButton>
                            </InputAdornment> : null,
                        }}
                        error={errors.users[index] !== undefined}
                        onChange={(e) => updateUser(e.target.value, index)}
                        value={u}
                        label="Gebruikers e-mail"
                        helperText={errors.users[index]}
                        variant="filled"
                    />)}
                    <FormGroup sx={{ marginLeft: "1em" }}>
                        <FormControlLabel disabled={sending} onChange={(e) => setFormState({ ...formState, join: e.target.checked })} control={<Checkbox checked={formState.join} />} label="Mijzelf toevoegen aan deze lijst" />
                    </FormGroup>
                </Box>

                <Box sx={{ display: "flex" }}>
                    <LoadingButton sx={{ marginRight: "auto", marginTop: "auto" }} loading={sending} type="submit" color="primary" variant="contained">Aanmaken</LoadingButton>
                    <IconButton sx={{ marginLeft: "auto" }} onClick={add}>
                        <Add fontSize="large" />
                    </IconButton></Box>
            </Box>
        </Collapse>
    </>
}


export default CreateList;