require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')

const connectDB = require('./db/connect')

const app = express()

const User = require('./models/User')

const year = require('./middleware/year')
let yearNow = year()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

// ! Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    year: yearNow
  })
})

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'register',
    year: yearNow
  })
})

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    if (user == null) {
      res.redirect('/register')
    } else {
      console.log(user)
      user.save()
      res.redirect('/login')
    }
  } catch (err) {
    console.log(err)
    res.redirect('/register')
  }
})

// ! Show all users in DB
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.render('users', {
      title: 'users',
      year: yearNow,
      users: users
    })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'login',
    year: yearNow,
    users: []
  })
})

app.post('/login', async (req, res) => {
  const user = await users.find(user => user.name = req.body.name)
  if (user == null) {
    res.redirect('/register')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.redirect('/about')
    } else {
      res.redirect('/register')
    }

  } catch (err) {
    console.log(err)
  }
})

app.get('/about', (req, res) => {
  res.render('/about', {
    title: 'about',
    year: yearNow
  })
})


// ! SERVER
const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL)
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()