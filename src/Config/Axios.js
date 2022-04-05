import _axios from "axios";
import { MainStore, defaultState } from './MainStore';
import { AxiosError } from './Helpers';
import { setCookie, getCookie } from 'react-use-cookie';
import { notificationPermissions } from "./Firebase";
import { openSnack } from "./UIStore";

const axios = _axios.create({ baseURL: process.env.REACT_APP_BASE_URL, withCredentials: true })

const defaultHandler = (message = "Er is iets mis gegaan!") => {
    openSnack(<>{message}</>);
    throw Error(message);
}




export const login = async ({ email, password, expire }) => {
    const errors = {};
    if (!email) errors.email = "* Verplicht";
    if (!password) errors.password = "* Verplicht";
    if (Object.keys(errors).length > 0) {
        throw new AxiosError(errors);
    }


    try {
        const { data } = await axios.post("login", { email, password, expire });
        MainStore.update(s => defaultState);
        await registerMessagingToken(await notificationPermissions());
        await retrieveLists();
        MainStore.update(s => {
            s.darkmode = getCookie("darkmode") === 'true'
            s.user = data
        });
    } catch (e) {
        if (e?.response?.data) throw new AxiosError(e.response.data);
        defaultHandler();
    }

}

export const register = async ({ username, email, password, passwordrepeat }) => {
    const errors = {};
    if (!username) errors.username = "* Verplicht";
    if (!email) errors.email = "* Verplicht";
    if (!password) errors.password = "* Verplicht";
    if (!passwordrepeat) errors.passwordrepeat = "* Verplicht";

    if (password && passwordrepeat && (passwordrepeat !== password)) {
        const str = "Wachtwoorden moeten overeen komen"
        errors.password = str;
        errors.passwordrepeat = str;
    }

    if (Object.keys(errors).length > 0) {
        throw new AxiosError(errors);
    }

    try {
        await axios.post("register", { username, email, password });
        await login({ email, password });

    } catch (e) {
        if (e?.response?.data) throw new AxiosError(e.response.data);
        defaultHandler();
    }
}

export const checkLogin = async () => {
    // await timeout(0)
    if (!getCookie("token")) {
        return false;
    };

    try {
        const { data } = await axios.get("validate");
        await registerMessagingToken(await notificationPermissions());
        await retrieveLists();
        MainStore.update(s => {
            s.user = data;
        });
        return data;
    } catch (e) {
        setCookie("token", "");
        return false;
    }
}

export const registerToken = async (token) => {
    try {
        await axios.post("user/messaging", { token });
    } catch (e) {
        defaultHandler("Kan notificaties niet tonen!");
    }
}

export const logout = async (history) => {

    await axios.delete("logout");
    setCookie("token", "");
    MainStore.update(s => {
        s.user = false;
    });
    if (history) history.push("/", { animation: false });

}

export const retrieveLists = async () => {
    try {
        const { data } = await axios.get("main");
        MainStore.update(s => {
            s.lists = data.lists;
            s.ended = data.ended;
            s.users = data.users;
            s.userDrinks = data.userDrinks;
        });
    } catch (e) {
        console.log(e);
        defaultHandler(e?.response?.data?.message);
    }
}

export const joinList = async (shareId) => {
    try {
        await axios.post("list/user", { shareId: shareId });
        await retrieveLists();
    } catch (e) {
        defaultHandler("Deze lijst bestaat niet!");
    }
}



export const addDrink = async (listId, amount, user = false, date = Date.now()) => {
    try {
        const { data } = await axios.post("list/drink", { id: listId, amount: amount, user: user, date });
        await retrieveDrinksForListUser(listId, user || MainStore.currentState.user._id);
        await retrieveLists();
        return data;
    } catch (e) {
        defaultHandler();
    }
}

export const removeDrink = async (listId, drink) => {
    try {
        await axios.delete("list/drink", { data: { id: drink._id } });
        await retrieveDrinksForListUser(listId, drink.user);
        await retrieveLists();
    } catch (e) {
        defaultHandler();
    }
}

export const editDrink = async (oldDrink, amount, date) => {
    try {
        const { data } = await axios.put("list/drink", { listId: oldDrink.listId, id: oldDrink._id, amount: amount, date: date });
        await retrieveDrinksForListUser(oldDrink.listId, oldDrink.userId);
        await retrieveLists();
        return data;
    } catch (e) {
        defaultHandler()
    }
}

export const retrieveDrinksForListUser = async (listId, userId) => {
    try {
        const { data } = await axios.get(`list/${listId}/user/${userId}`);
        MainStore.update(s => {
            if (s.drinks[listId] === undefined) s.drinks[listId] = {};
            // if(s.drinks[listId][userId] === undefined) s.drinks[listId][userId] = [];

            s.drinks[listId][userId] = data;
        });
    } catch (e) {
        defaultHandler();
    }
}

export const retrieveDrinksForList = async (listId) => {
    try {
        const { data } = await axios.get(`list/${listId}/drinks`);
        MainStore.update(s => {
            if (s.drinks[listId] === undefined) s.drinks[listId] = {};
            // if(s.drinks[listId][userId] === undefined) s.drinks[listId][userId] = [];

            s.drinks[listId] = data.reduce((a, b) => {
                if (a[b.user] === undefined) a[b.user] = [];
                a[b.user].push(b);
                return a;
            }, {});
        });
    } catch (e) {
        defaultHandler();
    }
}

export const registerMessagingToken = async (token) => {
    try {
        await axios.post(`/user/messaging`, { token });
    } catch (e) {
        defaultHandler();
    }
}

export const createList = async (name, price, join, users) => {
    const errors = { users: [] };
    if (!name) errors.name = "* Verplicht";
    if (!price) errors.price = "* Verplicht";
    users = users.filter(u => u !== "");
    if (hasDuplicates(users)) {
        defaultHandler("Een email mag maar één keer voor komen");
    }

    if (Object.keys(errors).length > 1) {
        throw new AxiosError(errors);
    }

    try {
        await axios.post("list", { name, join, price, users });
        await retrieveLists();
    } catch (e) {
        if (e?.response?.status === 404) {
            throw new AxiosError({ users: users.map(u => e.response.data.emails.includes(u) ? "Gebuiker bestaat niet" : undefined) })
        }
        defaultHandler();
    }


}

export const notifyList = async (listId) => {
    try {
        await axios.post(`/list/notify`, { id: listId });
    } catch (e) {
        defaultHandler();
    }
}

export const endList = async (listId) => {
    try {
        throw new Error();
    } catch (e) {
        defaultHandler();
    }
}

export const removeList = async (listId) => {
    try {
        throw new Error();
    } catch (e) {
        defaultHandler();
    }
}

const hasDuplicates = (array) => (new Set(array)).size !== array.length;

export const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));