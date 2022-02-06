const routes = require('express').Router();

const auth = require("./auth");
routes.use('/', auth);

const User = require("../database/models/User");
const List = require("../database/models/List");
const Drink = require("../database/models/Drink")
const { sendJoinRequest } = require('../email/mail');
const { EndedList } = List;


routes.use(async (req, res, next) => {
  if (req.cookies.token !== undefined) {
    const user = await User.findOne({ token: req.cookies.token });
    if (user !== null) {
      res.locals.user = user;
      next();
      return;
    }
  }
  res.status(401).send();
})

routes.get("/lists", async (req, res) => {
  const inLists = await List.find({ "users.user": res.locals.user._id }).populate("users.user");
  const endedLists = await EndedList.find({ "users.user": res.locals.user._id }).populate("users.user");

  const ownedLists = (await List.find({ owner: res.locals.user._id })).map(list => ({ ...list.toJSON(), shareId: list.shareId }));
  const owned = [...ownedLists, ...(await EndedList.find({ owner: res.locals.user._id })).map(list => ({ ...list.toJSON(), ended: true }))];
  res.json({ lists: inLists, owned: owned, ended: endedLists });
});

routes.post("/list", async (req, res) => {
  const userEmails = req.body.users.filter(e => e !== res.locals.user.email && e !== "");

  const found = await User.find({ email: { $in: userEmails } });
  const notFound = userEmails.filter(mail => !found.find(f => f.email === mail));

  if(notFound.length > 0) {
    res.status(404).json({emails:notFound});
    return;
  }
  
  const list = await new List({ name: req.body.name, price: req.body.price, owner: res.locals.user._id, users: req.body.join ? [{ drinks: [], user: res.locals.user._id }] : [] }).save();

  const promises = found.map(u => sendJoinRequest(u, res.locals.user, list))
  Promise.all(promises).then(() => {
    res.json(list);
  }).catch(() => {
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

routes.post("/list/drink", async (req, res) => {
  const list = await List.findOne({ _id: req.body.id, "users.user": res.locals.user._id });

  const drink = await new Drink({ amount: req.body.amount, user:res.locals.user._id, list:list._id }).save();
  list.users.find(user => user.user.toString() === res.locals.user._id.toString()).drinks.push(drink._id);
  list.save();

  res.json(drink);
})

routes.delete("/list/drink", async (req, res) => {
  const list = await List.findOne({ _id: req.body.listId, "users.user": res.locals.user._id },);

  let drinks = list.users.find(u => u.user.toString() === res.locals.user._id.toString()).drinks;
  list.users.find(u => u.user.toString() === res.locals.user._id.toString()).drinks = drinks.filter(d => d._id.toString() !== req.body.drinkId);

  list.save();

  if (list.modifiedCount === 0) {
    res.status(404).send();
  }

  res.status(200).send();
})



module.exports = routes;