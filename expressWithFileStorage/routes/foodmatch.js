const express = require("express");
const fs = require("node:fs");
const router = express.Router();

router.get("/", (req,res) => {

    let fileResults = "";
    let finalDisplay = "";
    let firstName = "";
    let lastName = "";
    let food = "";
    let i = 0;
    let count = 0;

    fs.readFile("mydata.txt", (err, data) => {
        if(err)   {
            console.err(err);
        }
        else   {

            fileResults = data.toString();

            while(i <= fileResults.length)   {

                if(fileResults.charAt(i) == "^" || fileResults.charAt(i) == "*" || fileResults.charAt(i) == "%")   {


                }
                else if(fileResults.charAt(i) == "#")   {

                    count++;

                }
                else if(count == 0)   {

                    firstName += fileResults.charAt(i);


                }
                else if(count == 1)   {

                    lastName += fileResults.charAt(i);

                }
                else if(count == 2)   {

                    food += fileResults.charAt(i);

                }
                else if(count == 3)   {

                    if(food == req.query.foodname)   {

                        finalDisplay += "<p>" + firstName + " " + lastName + "</p>";

                    }

                    firstName = fileResults.charAt(i);
                    lastName = "";
                    food = "";

                    count = 0;

                }

                i++;

            }

            res.send(finalDisplay);

        }
    });

});

module.exports = router;