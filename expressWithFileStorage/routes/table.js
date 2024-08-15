const express = require("express");
const { table } = require("node:console");
const fs = require("node:fs");
const router = express.Router();

router.get("/", (req,res) => {
    
    let fileResults = "";
    let tableValue = "";
    let fullTable = "<table><tr><th>First Name</th><th>Last Name</th><th>Favorite Food</th></tr>";
    let i = 0;

    fs.readFile("mydata.txt", (err, data) => {
        if(err)   {
            console.err(err);
        }
        else   {
            fileResults = data.toString();


            while(i < fileResults.length)   {

                if(fileResults.charAt(i) == "^")   {

                    fullTable += "<tr>";

                }
                else if(fileResults.charAt(i) == "*")   {

                    fullTable += "<td>";

                }
                else if(fileResults.charAt(i) == "#")   {

                    fullTable += tableValue;
                    fullTable += "</td>";
                    tableValue = "";

                }
                else if(fileResults.charAt(i) == "%")  {

                    fullTable += "</tr>";

                }
                else {

                    tableValue += fileResults.charAt(i);

                }

                i++;

            }

            fullTable += "</table>";

            res.send(fullTable);
            

        }
    });
    
});

module.exports = router;