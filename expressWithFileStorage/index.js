const express = require("express");
const userInputRoutes = require("./routes/userinput");
const tableRoutes = require("./routes/table");
const foodMatchRoutes = require("./routes/foodmatch");

const app = express();
const port = 3000;

app.use("/userinput", userInputRoutes);
app.use("/table", tableRoutes);
app.use("/foodmatch", foodMatchRoutes);

app.use(express.static("public"));

app.listen(port, () => {
    console.log("Server started on port: " + port);
});