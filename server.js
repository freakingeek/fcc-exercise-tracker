const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// Middlewares

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// Database

const mongoInit = require('./database').initialize
const { User, Exercise } = require('./database/Models')

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username

  if (!username) {
    res.status(400).send({ error: 'Somthing bad happend!'})
  }

  const user = new User({ username })
  user.save()

  res.status(201).send(user)
})

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    res.status(400).send({ error: "Somthing bad happend!" });
  }

  const userId = req.params._id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        duration,
        description,
        date: date ? date : new Date().toDateString(),
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).send({ error: "Somthing bad happend!" });
  }

  res.send(user);
})

const listener = app.listen(process.env.PORT || 3000, async () => {
  await mongoInit()
  console.log('Your app is listening on port ' + listener.address().port)
})
