const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config({path: "./config.env"});
app.use(cors());
app.use(express.json()); //allows us to retrieve data in a json format
const recordRoute = require("./routes/record");

const dbo = require("./db/conn");

const port = process.env.PORT;

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