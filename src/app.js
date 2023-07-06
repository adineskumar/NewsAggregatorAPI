const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routers = require('express').Router();
const newsRoutes = require('../src/routers/newsRouter.js');
const authRoutes = require('../src/routers/authRouter.js');
const prefRoutes = require('../src/routers/preferenceRouter.js');
const mongoose = require('mongoose');
const { MONGO_URI } = require('../src/config/env.js');

try {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  });
  console.log("Mongo DB connection succesful");
} catch (err) {
  console.log('Error while connecting to Mongo DB');
}


const app = express();
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
app.use(cors());
app.use(routers);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.status(200).send('Welcome to News Aggregator API..:)')
});

routers.use(bodyParser.urlencoded({ extended: false }));
routers.use(bodyParser.json());

routers.use('/', authRoutes);
routers.use('/news', newsRoutes);
routers.use('/preferences', prefRoutes);


const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log('Error starting Server..!')
  } else {
    console.log('News Aggregator Server is running at port ', PORT);
  };
});

module.exports = routers;