const routes = require('express').Router();
const User = require("../database/models/User");
const { v4: uuid } = require('uuid');
const { Validator, mapper } = require('../validator');
const { sendPasswordReset } = require("../messaging/mail");
const jwt = require('jsonwebtoken');

const year = 1000*60*60*24*365;

routes.get('/validate', async (req, res) => {
    if (!req.cookies.token) {
        res.status(401).send();
        return;
    }
    const user = await User.findOne({ "tokens.token": req.cookies.token });
    if (user) {
        res.send({ username: user.username, email: user.email, _id: user._id });
    } else {
        res.status(401).send();
    }
});


routes.post('/register', async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email',
        password: 'required|minLength:5',
        username: 'required|minLength:3',
    });

    const matched = await v.check();

    if (!matched) {
        res.status(400).json(mapper(v.errors));
        return;
    }

    try{
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }).save();
        res.status(201).json(user);
    }catch(e){
        if(e && e.code === 11000){
            res.status(400).json({ email:"Email bestaat al" });
        }
    }
});

routes.delete("/logout", async (req, res) => {
  if (req.cookies.token !== undefined) {
    await User.updateOne({ "tokens.token": req.cookies.token }, {
        $pull:{
          tokens: { token: req.cookies.token }
        }
      });
    res.status(200).send();
  }
  res.status(401).send();
})


routes.post("/login", async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email',
        password: 'required|minLength:5',
    });

    const matched = await v.check();

    if (!matched) {
        res.status(400).send(mapper(v.errors));
        return;
    }



    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
        return res.status(400).send({
            email: "Combinatie onbekend.",
            password: "Combinatie onbekend."
        });
    } else {
        if (user.validatePassword(req.body.password)) {
            const token = uuid();
            user.tokens.push({token:token, expire:!!req.body.expire});
            await user.save();
            return res.status(201).cookie("token", token, req.body.expire ? {} : { maxAge: year }).send({ username: user.username, email: user.email, _id: user._id });
        }
        else {
            return res.status(400).send({
                email: "Combinatie onbekend.",
                password: "Combinatie onbekend."
            });
        }
    }

})

routes.post('/password-reset', async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required|email',
    });

    const matched = await v.check();

    if (!matched) {
        return res.status(400).json(mapper(v.errors));
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        await sendPasswordReset(user, jwt.sign({ id: user._id }, process.env.JWT_SECRET || "temp"));
    }

    res.status(200).send({ message: 'Er is een reset link verstuurd indien de mail bekend is.' });
});


routes.post("/password-reset/finish", async (req, res) => {
    const v = new Validator(req.body, {
        password: 'required|minLength:5',
        token: 'required',
    });

    const matched = await v.check();

    if (!matched) {
        return res.status(400).json(mapper(v.errors));
    }

    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || "temp");
    const user = await User.findById(decoded.id);

    if (user) {
        user.password = req.body.password;
        await user.save();
        return res.status(200).send({ message: 'Wachtwoord succesvol gereset.' });
    }

    res.status(400).send({ message: 'Ongeldige token.' });
});

module.exports = routes;
