require("./database/mongoose");
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const app = express();

const port = process.env.PORT || 3000;

// Routers Declaration
const groceryRouter = require("./routers/groceryRouter");
const babyMonitorRouter = require("./routers/babyMonitorRouter");

// Cors white list and JSON
app.use(cors());
app.use(express.json());

// Routers
app.use(groceryRouter);
app.use(babyMonitorRouter);
app.use(errorHandler);

app.listen(port, async () => console.log(`Server is online on Port: ${port}`));
