import { Store } from "pullstate";
import { setCookie, getCookie } from 'react-use-cookie';

export const defaultState = {
    snack: {},
    user: false,
    lists: {
        lists:[],
        owned:[],
        ended:[]
    },
    darkmode: getCookie("darkmode") === 'true'
}



export const MainStore = new Store(defaultState);

export const setDarkMode = (mode = !MainStore.currentState.darkmode) => {
    setCookie("darkmode", mode);
    MainStore.update(s => ({ ...s, darkmode: mode }));
}

