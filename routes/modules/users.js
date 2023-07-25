const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  if (!email || !password) {
    errors.push({ message: '請輸入帳號和密碼' })
    return res.render('login', { errors })
  }
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      errors.push(info)
      return res.render('login', { errors })
    }
    res.logIn(user, () => {
      return res.redirect('/')
    })
  })(req, res, next)
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位皆為必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: '這個信箱已經註冊過。' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router