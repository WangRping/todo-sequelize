const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const name = req.body.name
  const UserId = req.user.id
  Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Todo.findOne({ where: { id }, raw: true, nest: true })
    .then(todo => res.render('edit', { todo }))
})

router.post('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const { name, isDone } = req.body;
  Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name,
        todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/`))
    .catch(err => console.log(err))
})

router.post('/:id/delete', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.findOne({ where: { UserId, id } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router