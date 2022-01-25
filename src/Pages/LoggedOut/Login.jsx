import { Button, CardActions, Box, CardContent, FormGroup, FormControlLabel, Card, Typography, Checkbox, FormControl, InputLabel, FormHelperText, OutlinedInput } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from '@mui/lab';
import { login } from "../../Config/Axios";
import { AxiosError } from './../../Config/Helpers';




const Login = ({swap}) => {
    const [formState, setFormState] = useState({
        checkbox: true,
        email: "",
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


        login({ email: formState.email, password: formState.password }).then(() => {
            setSending(false);
        }).catch((e) => {
            setSending(false);
            if (e instanceof AxiosError) {
                setErrors(e.response.data);
            }else{
                throw e;
            }
        });
    }

    return <Card>
            <CardContent component="form" sx={{ display: "flex", flexDirection: "column", '& .MuiFormControl-root': { mb: 2 } }} noValidate onSubmit={submit}>
                <Typography variant="h5" component="div" mb={2}>
                    Login
                </Typography>
                <FormControl disabled={sending} error={!!errors.email}>
                    <InputLabel htmlFor="login-email">Email</InputLabel>
                    <OutlinedInput
                        id="login-email"
                        value={formState.email}
                        onChange={updateForm}
                        type="email"
                        inputProps={{ prop: "email" }}
                        label="Email"
                        aria-describedby="login-email-text"
                    />
                    {!errors.email ? null : <FormHelperText id="login-email-text">{errors.email}</FormHelperText>}
                </FormControl>
                <FormControl disabled={sending} error={!!errors.password}>
                    <InputLabel htmlFor="login-password">Wachtwoord</InputLabel>
                    <OutlinedInput
                        id="login-password"
                        value={formState.password}
                        onChange={updateForm}
                        inputProps={{ prop: "password" }}
                        label="Wachtwoord"
                        type="password"
                        aria-describedby="login-password-text"
                    />
                    {!errors.password ? null : <FormHelperText id="login-password-text">{errors.password}</FormHelperText>}
                </FormControl>
                <FormGroup>
                    <FormControlLabel disabled={sending} onChange={(e) => setFormState({ ...formState, checkbox: e.target.checked })} control={<Checkbox checked={formState.checkbox} />} label="Blijf ingelogd" />
                </FormGroup>
                <Box sx={{ alignSelf: "end" }}><LoadingButton loading={sending} type="submit" color="primary" variant="contained">Inloggen</LoadingButton></Box>
            </CardContent>

            <CardActions>
                <Button onClick={() => swap("register","swap-left")} size="small">Nog geen account? Registreer hier!</Button>
            </CardActions>
        </Card>

}


export default Login;