const express = require('express')
const cors = require('cors');
require('dotenv').config();
const User = require('./models/user.js');
const { default: mongoose } = require('mongoose');
const app = express();
var bcrypt = require('bcryptjs');

const bcryptsalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5174',
}));

mongoose.connect(process.env.mongo_url);

app.get("/test", (req, res) => {
  res.json("test ok")
})
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userData = await User.create({
    name,
    email,
    password:bcrypt.hashSync(password, bcryptsalt),
  })
  res.json(userData);
})

app.listen(4000);