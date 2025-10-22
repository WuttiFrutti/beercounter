import IconPage from '../IconPage';
import { useHistory, useParams } from 'react-router-dom';


import { Button, CardActions, Box, CardContent, Typography, FormControl, InputLabel, Card, FormHelperText, OutlinedInput, Container } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from '@mui/lab';
import { reset } from "../../Config/Axios";
import { AxiosError } from './../../Config/Helpers';

const ResetPassword = ({ token }) => {
    const history = useHistory();
    const params = useParams();

    const [formState, setFormState] = useState({
        checkbox: true,
        email: "",
        passwordrepeat: "",
        username: "",
        password: ""
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


        reset({ token, passwordrepeat: formState.passwordrepeat, password: formState.password }).then(() => {
            history.push('/');
        }).catch((e) => {
            if (e instanceof AxiosError) {
                setErrors(e.response.data);
            }
            setSending(false);
        });
    };
    return <IconPage><Box sx={{ minWidth: "100vw", paddingBottom: "1em" }}><Container maxWidth="sm">
        <Card>
            <CardContent component="form" sx={{ display: "flex", flexDirection: "column", '& .MuiFormControl-root': { mb: 1 } }} noValidate onSubmit={submit}>
                <Typography variant="h5" component="div" mb={2}>
                    Wachtwoord resetten
                </Typography>
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
                <Box sx={{ alignSelf: "end" }}><LoadingButton loading={sending} type="submit" color="primary" variant="contained">Reset</LoadingButton></Box>
            </CardContent>

            <CardActions>

            </CardActions>
        </Card>
    </Container></Box></IconPage>;

};


export default ResetPassword;
