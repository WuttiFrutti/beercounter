import { Button, CardActions, Box, CardContent, Typography, FormControl, InputLabel, Card, FormHelperText, OutlinedInput } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from '@mui/lab';
import { register } from "../../Config/Axios";
import { AxiosError } from './../../Config/Helpers';




const Register = ({swap}) => {
    const [formState, setFormState] = useState({
        checkbox: true,
        email: "",
        passwordrepeat:"",
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);


    const updateForm = (e) => {
        setFormState({ ...formState, [e.target.attributes.prop.value]: e.target.value });
    }


    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);


        register({ username: formState.username, email: formState.email, passwordrepeat: formState.passwordrepeat, password: formState.password }).then({

        }).catch((e) => {
            if (e instanceof AxiosError) {
                setErrors(e.response.data);
            }
            setSending(false);
        });
    }

    return <Card>
            <CardContent component="form" sx={{ display: "flex", flexDirection: "column", '& .MuiFormControl-root': { mb: 1 } }} noValidate onSubmit={submit}>
            <Typography variant="h5" component="div" mb={2}>
                Registreren
            </Typography>
            <FormControl disabled={sending} error={!!errors.username}>
                <InputLabel htmlFor="register-username">Gebruikersnaam</InputLabel>
                <OutlinedInput
                    id="register-username"
                    value={formState.username}
                    onChange={updateForm}
                    inputProps={{ prop: "username" }}
                    label="Gebruikersnaam"
                    aria-describedby="register-username-text"
                />
                {!errors.username ? null : <FormHelperText id="register-username-text">{errors.username}</FormHelperText>}
            </FormControl>
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
            <FormControl disabled={sending} error={!!errors.password}>
                <InputLabel htmlFor="register-password">Wachtwoord</InputLabel>
                <OutlinedInput
                    id="register-password"
                    value={formState.password}
                    onChange={updateForm}
                    inputProps={{ prop: "password" }}
                    label="Wachtwoord"
                    type="password"
                    aria-describedby="register-password-text"
                />
                {!errors.password ? null : <FormHelperText id="register-password-text">{errors.password}</FormHelperText>}
            </FormControl>
            <FormControl disabled={sending} error={!!errors.passwordrepeat}>
                <InputLabel htmlFor="register-password-repeat">Wachtwoord Herhalen</InputLabel>
                <OutlinedInput
                    id="register-password-repeat"
                    value={formState.passwordrepeat}
                    onChange={updateForm}
                    inputProps={{ prop: "passwordrepeat" }}
                    label="Wachtwoord Herhalen"
                    type="password"
                    aria-describedby="register-password-repeat-text"
                />
                {!errors.passwordrepeat ? null : <FormHelperText id="register-password-repeat-text">{errors.passwordrepeat}</FormHelperText>}
            </FormControl>
            <Box sx={{ alignSelf: "end" }}><LoadingButton loading={sending} type="submit" color="primary" variant="contained">Inloggen</LoadingButton></Box>
        </CardContent>

            <CardActions>
                <Button onClick={() => swap("login","swap-right")} size="small">Heb je al een account? Log hier in!</Button>
            </CardActions>
            </Card>

}


export default Register;