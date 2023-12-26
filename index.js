const AdminRouters = require('./Router/AdminRouters');
const UserRouters = require('./Router/UserRouters');
const OrderRouters = require('./Router/OrderRoutes');

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const port = process.env.PORT;
const url = process.env.URL;

const mongoDBConnection = async () => {
  try {
    const connection = await mongoose.connect(url);
    if (connection) {
      console.log("Connected to MongoDB");
    } else {
      console.log("Unable to connect to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};


app.use('/api', AdminRouters);
app.use('/api', UserRouters);
app.use('/api', OrderRouters);


app.listen(port, () => {
  mongoDBConnection();
  console.log("http://localhost:3001");
});
