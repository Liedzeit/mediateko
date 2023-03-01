const express = require('express')
const router = express.Router()
const Book = require('../models/book')


router.get('/', async (req, res) => {
    let msg = "Just a test"
    console.log(msg)
    
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    books = []
  }
  res.render('index', { books: books })
})

module.exports = router