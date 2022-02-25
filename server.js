const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Middlewares

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Database

const mongoInit = require("./database").initialize;
const { User, Log } = require("./database/Models");

// Routes

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username;

  if (!username) {
    res.status(400).send({ error: "Somthing bad happend!" });
  }

  const user = new User({ username });
  user.save();

  res.status(201).send(user);
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    res.status(400).send({ error: "Somthing bad happend!" });
  }

  const userId = req.params._id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).send({ error: "Somthing bad happend!" });
  }

  const data = {
    description,
    duration: +duration,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  const log = new Log({ ...data, userId: user._id });
  log.save();

  res.send({ ...data, _id: user._id, username: user.username });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const userId = req.params._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).send({ error: "Somthing bad happend!" });
  }

  let log
  const filters = req.query
  const options = {}

  if (filters.limit) options.limit = filters.limit

  // if (filters.to) {
  //   log = await Log.find({ userId, date: { $lt: filters.to } }, { _id: 0, userId: 0 }, options);
  // }

  if (filters.from && filters.to) {
    log = await Log.find({ userId, date: { $gte: filters.from, $lt: filters.to } }, { _id: 0, userId: 0 }, options);
  }

  if (!filters.to || !filters.from) {
    log = await Log.find({ userId }, { _id: 0, userId: 0 }, options);
  }

  // Change date
  const formatedLogs = log.map(({ description, duration, date}) => ({
    duration,
    description,
    date: new Date(date).toDateString()
  }))

  res.send({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: formatedLogs,
  });
});

const listener = app.listen(process.env.PORT || 3000, async () => {
  await mongoInit();
  console.log("Your app is listening on port " + listener.address().port);
});
