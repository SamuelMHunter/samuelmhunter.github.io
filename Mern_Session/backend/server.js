const express = require("express");
const app = express();

const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config({path: "./config.env"});
const port = process.env.PORT;
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(session(
    {
        secret: "keyboard cat",
        saveUninitialized: false,
        resave: MongoStore.create({
            mongoUrl: process.env.ATLAS_URI
        })
    }
));
app.use(express.json()); //allows us to retrieve data in a json format
const recordRoute = require("./routes/record");

const dbo = require("./db/conn");

app.use(recordRoute);

app.get("/", (req,res) => {

    res.send("Hello, world!");

});

app.listen(port, () => {
    dbo.connectToServer(function(err) {
        if(err) {
            console.err(err);
        }
    });
    console.log(`Server is running on port ${port}`);
});