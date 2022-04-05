import { Store, registerInDevtools } from "pullstate";
import { setCookie, getCookie } from 'react-use-cookie';
import { retrieveDrinksForListUser, retrieveDrinksForList } from './Axios';

export const defaultState = {
    user: false,
    lists: [],
    ended: [],
    users: [],
    drinks: {},
    userDrinks: [],
    darkmode: getCookie("darkmode") === 'true'
}



export const MainStore = new Store(defaultState);

export const setDarkMode = (mode = !MainStore.currentState.darkmode) => {
    setCookie("darkmode", mode);
    MainStore.update(s => ({ ...s, darkmode: mode }));
}

export const getDrinks = (listId, userId) => (s) => {
    if (listId === undefined) return [];

    if (userId === undefined) {
        if (s.drinks[listId] === undefined) {
            MainStore.update(s => { s.drinks[listId] = {} });
            retrieveDrinksForList(listId);
            return;
        }
        return Object.values(s.drinks[listId]).flat();
    } else {
        if (s.drinks[listId] === undefined) {
            MainStore.update(s => { s.drinks[listId] = {} });
            return;
        }
        if (s.drinks[listId][userId] === undefined) {
            MainStore.update(s => { s.drinks[listId][userId] = [] });
            retrieveDrinksForListUser(listId, userId);
        }
        return s.drinks[listId][userId];
    }
}

registerInDevtools({
    MainStore,
});