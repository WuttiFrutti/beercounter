const routes = require('express').Router();

const auth = require("./auth");
routes.use('/', auth);

const User = require("../database/models/User");
const List = require("../database/models/List");
const Drink = require("../database/models/Drink")
const { sendJoinRequest } = require('../messaging/mail');
const { EndedList } = List;
const messaging = require("../messaging/messaging");




const expirationCheck = async (req, user) => {
  const token = user.getTokens().find(t => t.token === req.cookies.token);
  
  if(!token){
    await User.updateOne({ "tokens.token": req.cookies.token }, {
      $pull:{
        tokens: { token: req.cookies.token }
      }
    });
    return false;
  }
  return true;
}

routes.use(async (req, res, next) => {
  if (req.cookies.token !== undefined) {
    const user = await User.findOneAndUpdate({ "tokens.token": req.cookies.token }, { 
      $set: {
        "tokens.$.updatedAt": Date.now()
      }
    });
    if (user !== null) {
      if(expirationCheck(req,user)){
        res.locals.user = user;
        next();
      }else{
        res.status(401).cookie("token","",{ maxAge:0 }).send({ message:"je Sessie is verlopen!" });
      }
      return;
    }
  }
  res.status(401).send();
})

routes.get("/main", async (req, res) => {
  let inLists = await List.find({ $or: [{ "users.user": res.locals.user._id }, { owner: res.locals.user._id }] });
  let endedLists = await EndedList.find({ $or: [{ "users.user": res.locals.user._id }, { owner: res.locals.user._id }] });
  const drinks = await Drink.find({ user: res.locals.user._id });

  const map = list => (list.owner.toString() === res.locals.user._id.toString() ? { ...list.toJSON(), shareId: list.shareId } : list)

  inLists = inLists.map(map);
  endedLists = endedLists.map(map);

  const withUsers = [...(new Set([...endedLists, ...inLists].map(list => list.users.map(users => users.user.toString())).flat()))];

  const users = await User.find({ _id: { $in: withUsers } });

  res.json({ lists: inLists, ended: endedLists, users: users, userDrinks: drinks });
});


routes.get("/list/:listId/user/:userId", async (req, res) => {
  const drinks = await Drink.find({ list: req.params.listId, user: req.params.userId });
  res.send(drinks);
});

routes.get("/list/:listId/drinks", async (req, res) => {
  const drinks = await Drink.find({ list: req.params.listId });
  res.send(drinks);
});

routes.post("/user/messaging", async (req, res) => {
  res.locals.user.tokens.find(t => t.token === req.cookies.token).messageToken = req.body.token;
  await res.locals.user.save();
  res.send();
});


routes.post("/list", async (req, res) => {
  const userEmails = req.body.users.filter(e => e !== res.locals.user.email && e !== "");

  const found = await User.find({ email: { $in: userEmails } });
  const notFound = userEmails.filter(mail => !found.find(f => f.email === mail));

  if (notFound.length > 0) {
    res.status(404).json({ emails: notFound });
    return;
  }

  const list = await new List({ name: req.body.name, price: req.body.price, owner: res.locals.user._id, users: req.body.join ? [{ drinks: [], user: res.locals.user._id }] : [] }).save();

  const devices = found.map(u => u.getTokens().map(t => t.messageToken)).flat();
  if(devices.length > 0){
    messaging.sendToDevice(devices, {
      data: {
        title: `Je bent uitgenodigd voor een lijst`,
        body: `${res.locals.user.username} heeft je uitgenodigd voor een drank lijst!`,
        data: JSON.stringify({ url: `${process.env.FRONTEND_URL}/join/${list.shareId}` }),
        actions: JSON.stringify([
          { action: 'join', title: 'Mee doen' },
          { action: 'close', title: 'Sluiten' },
        ]),
      }
    });
  }
  
  Promise.all(found.map(f => sendJoinRequest(f, res.locals.user, list))).then((e) => {
    res.json(list);
  }).catch((e) => {
    console.log(e);
    res.status(401).json(list)
  });

});

routes.put("/list", async (req, res) => {
  const list = await List.findOneAndRemove({ _id: req.body.id, owner: res.locals.user._id });

  let returnList = null;
  if (list !== null) {
    returnList = await new EndedList(list.toJSON()).save();
  } else {
    const list = await EndedList.findOneAndRemove({ _id: req.body.id, owner: res.locals.user._id });
    returnList = await new List(list.toJSON()).save();
  }

  res.json(returnList);
});

routes.post("/list/user", async (req, res) => {
  const list = await List.findOneAndUpdate({ shareId: req.body.shareId, 'users.user': { $ne: res.locals.user._id } }, { $push: { users: { drinks: [], user: res.locals.user._id } } });
  if (list) {
    res.status(201).send();
  } else {
    res.status(404).send();
  }
});

routes.post("/list/notify", async (req, res) => {
  const list = await List.findOne({ _id: req.body.id, owner: res.locals.user._id }).populate("users.user");
  const devices = list.users.reduce((a, b) => b.user._id.toString() === res.locals.user._id.toString() ? a : [...a, ...b.user.getTokens().map(t => t.messageToken)], []);
  if(devices.length > 0){
    console.log("sending to ", devices);
    messaging.sendToDevice(devices,{
      data: {
        title: `Vul je lijst in.`,
        body: `${res.locals.user.username} heeft gevraagd of je de lijst kan invullen!`,
        data: JSON.stringify({ url: `${process.env.FRONTEND_URL}` }),
        actions: JSON.stringify([
          { action: 'join', title: 'Invullen' },
          { action: 'close', title: 'Sluiten' },
        ]),
      }
    });
  }
  res.send();
});

routes.post("/list/drink", async (req, res) => {
  const list = await List.findOne({ _id: req.body.id, "users.user": res.locals.user._id });

  const drink = await new Drink({ amount: req.body.amount, user: res.locals.user._id, list: list._id }).save();
  const user = list.users.find(user => user.user.toString() === res.locals.user._id.toString());
  user.drinks.push(drink._id);
  user.total += drink.amount;
  list.total += drink.amount;
  res.locals.user.total += drink.amount;

  res.locals.user.save();
  list.save();

  res.json(drink);
})

routes.delete("/list/drink", async (req, res) => {
  const drink = await Drink.findOne({ _id: req.body.id, user: res.locals.user._id });
  const list = await List.findOne({ _id: drink.list });

  const user = list.users.find(u => u.user.toString() === res.locals.user._id.toString());
  const index = user.drinks.findIndex(d => d._id.toString() === req.body.drinkId);
  user.drinks.splice(index, 1);

  user.total -= drink.amount;
  list.total -= drink.amount;
  res.locals.user.total -= drink.amount;

  await list.save();
  await drink.remove();
  await res.locals.user.save();


  res.status(200).send();
})



module.exports = routes;