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
            res.json("There is already an account associated with provided email.");
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
            res.json("New profile creation successful.");
        }
    } catch(err){
        throw err;
    }
});

// Checks if an email/password pair matches any found in the data store
recordRoutes.route("/record/check").post(async (req, res) => {
    try {
        console.log("Checking if account exists using email/password pair.");
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = { email: req.body.email,
                        password: req.body.password
        };
        const accountExists = await records.findOne(query);
        if(accountExists) {
            res.json("Success: Account found.");
        }
        else {
            res.json("Failure: Account not found.");
        }
    } catch(err) {
        throw err;
    }
});

// Retrieves all user accounts
recordRoutes.route("/record").get(async (req, res) => {
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
recordRoutes.route("/record/account").post(async (req, res) => {
    try{
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = {email: req.body.email};
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

recordRoutes.route("/record/update").post(async (req, res) => {
    try {
        const db_connect = dbo.getDb();
        const records = db_connect.collection("records");
        const query = {email: req.body.email};
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
        const query = {email: req.body.email};
        let result;
        if(req.body.checking){
            console.log(`Attempting to deposit ${req.body.checking} into checking.`);
            records.updateOne(query, { $inc: {checking: req.body.checking}}, {});
        }
        else if(req.body.savings){
            console.log(`Attempting to deposit ${req.body.savings} into savings.`);
            records.updateOne(query, { $inc: {savings: req.body.savings}}, {});
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
        if(req.body.checking) {
            query = {email: req.body.email,
                checking: { $gte: req.body.checking}
            };
            if(await records.countDocuments(query) < 1){
                result = "Withdrawal was not successful.";
            }
            else{
                result = "Withdrawal was successful.";
            }
            records.updateOne(query, { $inc: {checking: (req.body.checking * -1)}}, {});
        }
        else if(req.body.savings) {
            query = {email: req.body.email,
                savings: { $gte: req.body.savings}
            };
            if(await records.countDocuments(query) < 1){
                result = "Withdrawal was not successful.";
            }
            else{
                result = "Withdrawal was successful.";
            }
            records.updateOne(query, { $inc: {savings: (req.body.savings * -1)}}, {});
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
        if(req.body.checking) {
            query = {email: req.body.email,
                savings: { $gte: req.body.checking}
            };
            if(await records.countDocuments(query) < 1){
                result = "Transfer was not successful.";
            }
            else{
                result = "Transfer was successful.";
            }
            records.updateOne(query, { $inc: {checking: req.body.checking, savings: (req.body.checking * -1)}}, {});
        }
        else if(req.body.savings) {
            query = {email: req.body.email,
                checking: { $gte: req.body.savings}
            };
            if(await records.countDocuments(query) < 1){
                result = "Transfer was not successful.";
            }
            else{
                result = "Transfer was successful.";
            }
            records.updateOne(query, { $inc: {savings: req.body.savings, checking: (req.body.savings * -1)}}, {});
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