import { Store, registerInDevtools } from "pullstate";
import { setCookie, getCookie } from 'react-use-cookie';
import { retrieveDrinksForListUser } from './Axios';

export const defaultState = {
    snack: {},
    user: false,
    lists: {
        lists:[],
        owned:[],
        ended:[]
    },
    drinks:{},
    userDrinks: [],
    darkmode: getCookie("darkmode") === 'true'
}



export const MainStore = new Store(defaultState);

export const setDarkMode = (mode = !MainStore.currentState.darkmode) => {
    setCookie("darkmode", mode);
    MainStore.update(s => ({ ...s, darkmode: mode }));
}

export const getDrinks = (listId, userId) => (s) => {
    if(listId === undefined || userId === undefined) return [];
    if(s.drinks[listId] === undefined) {
        MainStore.update(s => { s.drinks[listId] = {} });
        return;
    }
    if(s.drinks[listId][userId] === undefined){
        MainStore.update(s => { s.drinks[listId][userId] = [] });
        retrieveDrinksForListUser(listId, userId);
    }
    return s.drinks[listId][userId];
}

registerInDevtools({
    MainStore,
  });