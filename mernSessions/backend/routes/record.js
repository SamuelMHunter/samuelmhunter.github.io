const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This will create a new account profile
recordRoutes.route("/record/add").post(async (req, res) => {
    try{
        console.log("Checking for duplicates.");
        const db_connect = dbo.getDb();
        const query = { email: req.body.email};
        const records = db_connect.collection("records");
        const dupeAccount = await records.countDocuments(query);
        if(dupeAccount > 0){
            console.log("Duplicates where found. Stopping.");
            res.status(403).json("Error");
        }
        else {
            console.log("No duplicates where found. Creating new account.");
            const newProfile = {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                role: "",
                savings: 0,
                checking: 0
            };
            records.insertOne(newProfile);
            console.log("In /record/add, session is " + req.session); //come back to this
            let status = "";
            if(!req.session.email) {
                req.session.email = req.body.email;
                status = "Session set.";
            } else {
                status = "Session already existed.";
            }
            console.log(status);
            const resultObj = {
                status: status
            };
            res.json(resultObj);
        }
    } catch(err){
        throw err;
    }
});

// Checks if an email/password pair matches any found in the data store
recordRoutes.route("/record/login").post(async (req, res) => {
    try {
        console.log("Checking if account exists using email/password pair.");
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = { email: req.body.email,
                        password: req.body.password
        };
        const accountExists = await records.findOne(query);
        if(accountExists) {
            console.log("Account exists, successful.");
            //res.json("Success: Account found.");
            console.log("In /record/login, session is " + req.session);
            let status = "";
            if(!req.session.email) {
                req.session.email = req.body.email;
                status = "Session set";
            } else {
                status = "Session already existed";
            }
            console.log(status);
            const resultObj = {
                status: status
            };
            res.json(resultObj);
        }
        else {
            res.status(403).json("Error occurred");
        }
    } catch(err) {
        throw err;
    }
});

recordRoutes.route("/record/logout").get(async (req, res) => {
    console.log("In /record/logout, session is " + req.session);
    req.session.destroy();
    let status = "No session set.";
    const resultObj = {
        status: status
    };
    res.json(resultObj);
});

// Retrieves all user accounts
recordRoutes.route("/records").get(async (req, res) => {
    try{
        console.log("Grabbing all user accounts.");
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = {};
        const options = { projection: {_id: 0,
            password: 0

        } };
        const cursor = records.find(query, options);
        const result = await cursor.toArray();
        res.json(result);
    } catch(err){
        throw err;
    }
});

// Displays account information related to the provided email address
recordRoutes.route("/record").get(async (req, res) => {
    try{
        //console.log("Email var is: " + req.params.email);
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        if(!req.session.email) {
            console.log("A session is not in progress.");
            res.status(403).json("empty");
        }
        else {
            console.log("A session is in progress. /record");
            const query = {email: req.session.email};
            const options = { projection: {_id: 0,
                password: 0

            } };
            const cursor = records.find(query, options);
            const result = await cursor.toArray();
            //console.log("What is this:" + result);
            res.json(result[0]);
        }
    } catch(err){
        throw err;
    }
});

recordRoutes.route("/record/update/:email").post(async (req, res) => {
    try {
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = {email: req.params.email};
        const options = {};
        const updateRole = { $set: {role: req.body.role}};
        records.updateOne(query, updateRole, options);
        res.json("Update successful.");
    } catch(err){
        throw err;
    }
});

recordRoutes.route("/deposit").post(async (req, res) => {
    try{
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = {email: req.session.email};
        if(req.body.checking){
            console.log(`Attempting to deposit ${req.body.checking} into checking.`);
            records.updateOne(query, { $inc: {checking: parseInt(req.body.checking)}}, {});
        }
        else if(req.body.savings){
            console.log(`Attempting to deposit ${req.body.savings} into savings.`);
            records.updateOne(query, { $inc: {savings: parseInt(req.body.savings)}}, {});
        }
        res.json("Deposited successfully.");
    } catch(err) {
        throw err;
    }
});

// Withdraws money from checking or savings of an account using provided email address
recordRoutes.route("/withdraw").post(async (req, res) => {
    try{
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        let query;
        let result;
        if(req.body.checking) {
            query = {email: req.session.email,
                checking: { $gte: parseInt(req.body.checking)}
            };
            if(await records.countDocuments(query) < 1){
                res.status(403).json("Error");
            }
            else{
                result = "Withdrawal was successful.";
            }
            records.updateOne(query, { $inc: {checking: (parseInt(req.body.checking) * -1)}}, {});
        }
        else if(req.body.savings) {
            query = {email: req.session.email,
                savings: { $gte: parseInt(req.body.savings)}
            };
            if(await records.countDocuments(query) < 1){
                res.status(403).json("Error");
            }
            else{
                result = "Withdrawal was successful.";
            }
            records.updateOne(query, { $inc: {savings: (parseInt(req.body.savings) * -1)}}, {});
        }
        res.json(result);
    }catch(err) {
        throw err;
    }
})

// Transfers money between checking and savings of an account using provided email address
recordRoutes.route("/transfer").post(async (req, res) => {
    try{
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        let query;
        let result;
        if(req.body.checking) {
            query = {email: req.session.email,
                savings: { $gte: parseInt(req.body.checking)}
            };
            if(await records.countDocuments(query) < 1){
                res.status(403).json("Error");
            }
            else{
                result = "Transfer was successful.";
            }
            records.updateOne(query, { $inc: {checking: parseInt(req.body.checking), savings: (parseInt(req.body.checking) * -1)}}, {});
        }
        else if(req.body.savings) {
            query = {email: req.session.email,
                checking: { $gte: parseInt(req.body.savings)}
            };
            if(await records.countDocuments(query) < 1){
                res.status(403).json("Error");
            }
            else{
                result = "Transfer was successful.";
            }
            records.updateOne(query, { $inc: {savings: parseInt(req.body.savings), checking: (parseInt(req.body.savings) * -1)}}, {});
        }
        res.json(result);
    }catch(err){
        throw err;
    }
});

// // This section will help you delete a record
// recordRoutes.route("/:id").delete(async (req, res) => {
//  try {
//     let db_connect = dbo.getDb();
//     let myquery = { _id: new ObjectId(req.params.id) };
//     const result = await db_connect.collection("records").deleteOne(myquery);
//     console.log("1 document deleted.");
//     res.json(result);
//  } catch(err) {
//      throw err;
//  }
// });
 
module.exports = recordRoutes;