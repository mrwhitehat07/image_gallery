const express = require('express');
const cors = require("cors");
const path = require("path");
const imageRoutes = require("./routes/imageRoutes");
const userRoute= require("./routes/userRoutes");
// const orderRoute = require("./routes/orderRoutes");
const PORT = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("./config/db");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api/images', imageRoutes);
app.use('/api/users', userRoute);
// app.use('/api/orders', orderRoute);

app.listen(PORT, console.log(`Listening on port ${PORT}`));