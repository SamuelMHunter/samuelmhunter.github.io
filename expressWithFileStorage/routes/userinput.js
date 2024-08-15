const express = require("express");
const fs = require("node:fs");
const router = express.Router();

router.get("/", (req, res) => {
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const favoritefood = req.query.favoritefood;
    const content = "^*" + firstname + "#*" + lastname + "#*" + favoritefood + "#%"; 

    fs.appendFile("mydata.txt", content, err => {
        if(err)   {
            console.err(err);
        }
    });
});

module.exports = router;