import { Button, CardActions, Box, CardContent, Typography, FormControl, InputLabel, Card, FormHelperText, OutlinedInput } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from '@mui/lab';
import { forgot } from "../../Config/Axios";
import { AxiosError } from './../../Config/Helpers';




const ForgotPassword = ({ swap }) => {
    const [formState, setFormState] = useState({
        checkbox: true,
        email: "",
        result: ""
    });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);


    const updateForm = (e) => {
        setFormState({ ...formState, [e.target.attributes.prop.value]: e.target.value });
    };


    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);


        forgot({ email: formState.email }).then(() => {
            setFormState({ ...formState, result: "Er is een email verstuurd indien het adres bekend is." });
            setSending(false);
        }).catch((e) => {
            if (e instanceof AxiosError) {
                setErrors(e.response.data);
            }
            setSending(false);
        });
    };

    return <Card>
        <CardContent component="form" sx={{ display: "flex", flexDirection: "column", '& .MuiFormControl-root': { mb: 1 } }} noValidate onSubmit={submit}>
            <Typography variant="h5" component="div" mb={2}>
                Wachtwoord vergeten
            </Typography>
            <FormControl disabled={sending} error={!!errors.email}>
                <InputLabel htmlFor="register-email">Email</InputLabel>
                <OutlinedInput
                    id="register-email"
                    value={formState.email}
                    type="email"
                    onChange={updateForm}
                    inputProps={{ prop: "email" }}
                    label="Email"
                    aria-describedby="register-email-text"
                />
                {!errors.email ? null : <FormHelperText id="register-email-text">{errors.email}</FormHelperText>}
            </FormControl>
            <Typography>{formState.result}</Typography>
            <Box sx={{ alignSelf: "end" }}><LoadingButton loading={sending} type="submit" color="primary" variant="contained">Versturen</LoadingButton></Box>
        </CardContent>

        <CardActions>
            <Button onClick={() => swap("login", "swap-left")} size="small">Terug</Button>
        </CardActions>
    </Card>;

};


export default ForgotPassword;
