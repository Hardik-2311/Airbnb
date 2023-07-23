const express = require('express')
const cors = require('cors');
require('dotenv').config();
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const app = express();
var bcrypt = require('bcryptjs');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const bcryptsalt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));

mongoose.connect(process.env.mongo_url);

app.get("/test", (req, res) => {
  res.json("test ok")
})
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userData = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptsalt),
    })
    res.json(userData);
  } catch (e) {
    res.status(422).json(e);
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    }
    else {
      res.status(422).json("pass not ok")
    }
  }
  else {
    res.json("not found")
  }
})

app.listen(4000);