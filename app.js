
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const usePassport = require('./config/passport')
const router = require('./routes/index')
const db = require('./models')
const Todo = db.Todo
const User = db.User

const PORT = 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

usePassport(app)

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})