const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const genres=["Fiction","Classics","Science","Science Fiction","Mystery","Philosophy","Miscellaneous","Biography","Auto Biography","Thriller","Film"]
   
let curerrmsg = ""




// All Books route
router.get('/', async (req, res) => {
    let query = Book.find()
    //console.log("Find genre " + JSON.stringify(req))
   
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.genre != null && req.query.genre != 'All') {
      query = query.where('genre', req.query.genre)
    }
   
    try {
      const books = await query.exec()
      //console.log("received results from db " + books.length)
      res.render('books/index', {
        books: books,
        genres: genres,
        searchOptions: req.query
      })
    } catch (e) {
      console.log(e.message)
      res.redirect('/')
    }
  })

// new Book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Show Book Route
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('books/show', { book: book })
  } catch {
    res.redirect('/')
  }
})


// Edit Book Route
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch (e) {
    console.log("Edit Error: " + e-message)
    res.redirect('/')
  }
})

// Create Book route -
router.post('/', async (req, res) => {

//console.log("startReadDate: " + req.body.startReadDate)
const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    readStartDate: new Date(req.body.readStartDate),
    readEndDate: new Date(req.body.readEndDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    publisher: req.body.publisher,
    genre: req.body.genre[0],
    rating: req.body.rating,
    originalTitle: req.body.originalTitle
})
//console.log("book " + book)
saveCover(book, req.body.cover)

try {
    const newBook = await book.save()
    console.log("NEW Id: " + newBook.id)
    res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
}
catch (er) {
  curerrmsg = er.message
    renderNewPage(res, book, true)
} 
})

// Update Book Route
router.put('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author //this is actually the authorID
    book.publishDate = new Date(req.body.publishDate)
    book.readStartDate = new Date(req.body.readStartDate)
    book.readEndDate = new Date(req.body.readEndDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    book.genre = req.body.genre[0]
    book.rating = req.body.rating
    book.publisher = req.body.publisher
    book.originalTitle = req.body.originalTitle
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }
     await book.save()
    res.redirect(`/books/${book.id}`)
  } catch (er){
    curerrmsg = "update error: "  + er.message

    console.log("update error: " + er.message)
    if (book != null) {
      renderEditPage(res, book, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Book Page
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})



async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book,
      genres: genres
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Book '+curerrmsg
      } else {
        params.errorMessage = 'Error Creating Book '+curerrmsg
      }
     
    }

    res.render(`books/${form}`, params)
  } catch (e) {
    console.log(e.message)
    res.redirect('/books')
  }
  
}


function saveCover(book, coverEncoded) {
    //console.log("saving cover")
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }


module.exports = router