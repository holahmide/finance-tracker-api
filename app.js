const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const { sequelize } = require('./models')
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 4000

// configuring app
const app = express()

var corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://127.0.0.1:8080", "http://localhost:8080"],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization'],

};
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(cookieParser());

//routes
app.use("/api", require("./routes/api"));

//Database
sequelize.sync({})
  .then(() => {
    app.listen(port)
    console.log(`Finance Records and planner running at http://localhost:${port}`)
  });