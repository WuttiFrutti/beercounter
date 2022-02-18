const express = require("express");

const cookieParser = require('cookie-parser');
const { v4: uuid } = require('uuid');
const cors = require('cors')
const { json, urlencoded } = require('body-parser');
const _ = require("./database");

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(json())
app.use(urlencoded({
    extended: true
}))
app.use(cookieParser(uuid()));

const routes = require('./routes');
app.use('/api', routes);

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.code ? err.code : 500).send(err.code ? err.toJson() : { message: err.message });
});


const server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Server started on: ${host}:${port}`)
});
