import { MainStore } from "./MainStore";

export class AxiosError extends Error {
    constructor(obj) {
        super();
        this.response = { data: obj, status: 500 };
        this.name = "AxiosCustomError";
    }
}


const cumulativeMap = (plot, id, arr) => {
    if (id === 0) return plot;
    const newPlot = { x: plot.x, y: plot.y + arr[id - 1].y, time: plot.time }
    arr[id] = newPlot;
    return newPlot;
}

export const mapDrinksToGraph = (drinks, { datapoints = 10, forceDif = undefined, absoluteStart = 0, cumulate = false }) => {

    let firstDate = new Date(drinks[0].createdAt).getTime();
    const lastDate = forceDif !== undefined ? Date.now() + absoluteStart : new Date(drinks[drinks.length - 1].createdAt).getTime();

    let part = (lastDate - firstDate) / datapoints;
    if (forceDif !== undefined) {
        part = forceDif;
        firstDate = lastDate - (part * datapoints);
        drinks = drinks.filter(d => new Date(d.createdAt).getTime() >= firstDate);
    }

    const points = [];

    const reducer = (a, time) => a.reduce((a, b) => ({ ...a, y: a.y + b.amount }), { x: points.length, y: 0, time: time });


    for (let _i = firstDate + part; _i <= lastDate; _i += part) {
        const i = Math.ceil(_i)
        points.push(reducer(drinks.filter(d => new Date(d.createdAt).getTime() <= i) || points.length === datapoints - 1, i));
        drinks = drinks.filter(d => new Date(d.createdAt).getTime() > i)
    }
    // if(drinks.length !== 0){
    //     points[points.length] = reducer(drinks, lastDate);
    // }

    return cumulate ? points.map(cumulativeMap) : points;
}

export const getDrinksFromUserId = (lists, userId) => [...reduceUsersToDrinks(mapListToUser(lists.ended, userId)), ...reduceUsersToDrinks(mapListToUser(lists.lists, userId))];

const mapListToUser = (list, userId) => list.map(l => l.users.filter(u => u.user._id === userId));

export const reduceUsersToDrinks = (users) => users.reduce((a, b) => a.concat(...b.map(u => u.drinks)), [])

export const mapDrinksToNumber = (drinks) => drinks.reduce((a, b) => a + b.amount, 0);

export const fillListUser = (user, users) => ({...user, user:users.find(u => u._id === user.user)});