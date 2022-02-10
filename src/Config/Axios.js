import _axios from "axios";
import { MainStore, defaultState } from './MainStore';
import { AxiosError } from './Helpers';
import { setCookie, getCookie } from 'react-use-cookie';
import { notificationPermissions } from "./Firebase";

const axios = _axios.create({ baseURL:process.env.REACT_APP_BASE_URL, withCredentials: true })

const defaultHandler = (message = "Er is iets mis gegaan!") => {
    MainStore.update(s => ({ ...s,snack:{ open:true, severity:"error", children:<>{message}</> }  }));
    throw Error(message);
}




export const login = async ({email, password}) => {
    const errors = {};
    if(!email) errors.email = "* Verplicht";
    if(!password) errors.password = "* Verplicht";
    if(Object.keys(errors).length > 0) {
        throw new AxiosError(errors);
    }


    try{
        const { data } = await axios.post("login",{email, password});
        MainStore.update(s => ({...defaultState, darkmode: getCookie("darkmode") === 'true', user: data}));
        await registerMessagingToken(await notificationPermissions());
        await retrieveLists();
    }catch(e){
        if(e?.response?.data) throw new AxiosError(e.response.data);
        defaultHandler();
    }

}

export const register = async ({username, email, password, passwordrepeat}) => {
    const errors = {};
    if(!username) errors.username = "* Verplicht";
    if(!email) errors.email = "* Verplicht";
    if(!password) errors.password = "* Verplicht";
    if(!passwordrepeat) errors.passwordrepeat = "* Verplicht";

    if(password && passwordrepeat && (passwordrepeat !== password)){
        const str = "Wachtwoorden moeten overeen komen"
        errors.password = str;
        errors.passwordrepeat = str;
    }

    if(Object.keys(errors).length > 0) {
        throw new AxiosError(errors);
    }

    try{
        await axios.post("register",{username, email, password});
        await login({email, password});

    }catch(e){
        if(e?.response?.data) throw new AxiosError(e.response.data);
        defaultHandler();
    }
}

export const checkLogin = async () => {
    // await timeout(0)
    if(!getCookie("token")){
        return false;
    };

    try{
        const { data } = await axios.get("validate");
        MainStore.update(s => {
            s.user = data;
        });
        await registerMessagingToken(await notificationPermissions());
        await retrieveLists();
        return true;
    }catch(e){
        setCookie("token","");
        return false;
    }
}

export const registerToken = async (token) => {
    try{
        const { data } = await axios.post("user/messaging", { token });
        console.log(`Registered: ${token} for messaging`);
    }catch(e){
        defaultHandler("Kan notificaties niet tonen!");
    }
}

export const logout = () => {

    setCookie("token","");
    MainStore.update(s => {
        s.user = false;
    })
}

export const retrieveLists = async () => {
    try{
        const { data } = await axios.get("main");
        MainStore.update(s => {
            s.lists = data.lists;
            s.ended = data.ended;
            s.users = data.users;
            s.userDrinks = data.userDrinks;
        });
    }catch(e){
        console.log(e);
        defaultHandler();
    }
}

export const joinList = async (shareId) => {
    try{
        const { data } = await axios.post("list/user",{ shareId: shareId });
        await retrieveLists();
    }catch(e){
        defaultHandler("Deze lijst bestaat niet!");
    }
}



export const addDrink = async (listId, amount) => {
    try{
        const { data } = await axios.post("list/drink",{ id: listId, amount:amount });
        await retrieveDrinksForListUser(listId, MainStore.currentState.user._id);
        await retrieveLists();
        return data;
    }catch(e){
        defaultHandler();
    }
}

export const undoDrink = async (listId, drinkId) => {
    try{
        const { data } = await axios.delete("list/drink",{ data:{ id:drinkId } });
        await retrieveDrinksForListUser(listId, MainStore.currentState.user._id);
        await retrieveLists();
    }catch(e){
        defaultHandler();
    }
}

export const retrieveDrinksForListUser = async (listId, userId) => {
    try{
        const { data } = await axios.get(`list/${listId}/user/${userId}`);
        MainStore.update(s => {
            if(s.drinks[listId] === undefined) s.drinks[listId] = {};
            // if(s.drinks[listId][userId] === undefined) s.drinks[listId][userId] = [];

            s.drinks[listId][userId] = data;
        });
    }catch(e){
        defaultHandler();
    }
}

export const registerMessagingToken = async (token) => {
    try{
        const { data } = await axios.post(`/user/messaging`, { token });
    }catch(e){
        defaultHandler();
    }
}

export const createList = async (name, price, join, users) => {
    const errors = { users: [] };
    if(!name) errors.name = "* Verplicht";
    if(!price) errors.price = "* Verplicht";
    users = users.filter(u => u !== "");
    if(hasDuplicates(users)){
        defaultHandler("Een email mag maar één keer voor komen");
    }

    if(Object.keys(errors).length > 1) {
        throw new AxiosError(errors);
    }

    try{
        const response = await axios.post("list",{ name, join, price, users });
        await retrieveLists();
    }catch(e){
        if(e?.response?.status === 404){
            throw new AxiosError({users: users.map(u => e.response.data.emails.includes(u) ? "Gebuiker bestaat niet" : undefined)})
        }
        defaultHandler();
    }
    

}

const hasDuplicates = (array) =>  (new Set(array)).size !== array.length;

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));