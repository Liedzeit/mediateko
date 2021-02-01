const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const fetch = require('node-fetch')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const fs = require ('fs')


const genres=["Fiction","Classics","Science","Science Fiction","Mystery","Philosophy","Miscellaneous","Biography","Auto Biography","Thriller","Film","Politics","History","Comics"]
   

let grbook
let curerrmsg = ""

const getGenre = (s) => {
  if (typeof s !== 'string') return ''
   s = s.split(",")[0]
  if (s=="science-fiction") return "Science Fiction"
  if (s=="auto-biography") return "Auto Biography"
  
  return s.charAt(0).toUpperCase() + s.slice(1)
}




// All Books route
router.get('/', async (req, res) => {
    let query = Book.find()
    //console.log("Find genre " + JSON.stringify(req))
   
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publisher != null && req.query.publisher != '') {
      console.log("query for " + req.query.publisher)
      query = query.regex('publisher', new RegExp(req.query.publisher, 'i'))
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



// needs bodyparser.json to work
router.post('/import', async (req, res) => {
  let data = req.body
  let counter = 0;
  let query = Author.find()
  console.log("importing " + data.length + " books.")
  for (var i = 0; i<data.length;i++) {
   grbook =  data[i]
    if (grbook["Date Read"] == "") continue

    let aname = grbook.Author
   
    console.log(aname) // does author already exist?
    query = query.where('name', aname)
    try {
      const authors = await query.exec()
      let authorId
      console.log("authors: " + JSON.stringify(authors))
      if (authors.length>0){
        authorId = authors[0].id
        console.log (`existing Author: ${aname} ${authorId}`)
        let title = grbook.Title
        console.log("title: " + title)
        saveGoodReadsbook(authorId,grbook)
        }
        else {
          counter ++;
          const author = new Author({
          name: aname
          })
        try{
        const newAuthor = await author.save()
        authorId = newAuthor.id
        console.log (`new Author: ${aname} ${newAuthor.id}`)
        saveGoodReadsbook(authorId,grbook)
        }
        catch (e){
            console.log('Error creating Author '+e.message) 
          }
        }
      }
      catch (e) {
      console.log(e.message)
    }
   
  }
  res.send({"added":counter})
})



async function saveGoodReadsbook(authorId,grbook){
  const isbn = grbook.ISBN.substring(2)
  const url = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
  console.log(isbn)
  
  console.log(url)
  let blob = getCover(url,isbn)
  //console.log("received blob")
  const book = new Book({
    title: grbook.Title,
    author: authorId,
    publishDate: grbook["Original Publication Year"],
    readStartDate: new Date(grbook["Date Read"]),
    readEndDate: new Date(grbook["Date Read"]),
    pageCount: grbook["Number of Pages"],
    description: grbook["My Review"],
    publisher: grbook.Publisher,
    genre: getGenre(grbook.Bookshelves),
    isbn: isbn,
    goodreadsid: grbook["Book Id"],
    
    rating: grbook["My Rating"]
    
  })
  /*if (blob != null && blob !== '') {
    console.log("size: " + blob.size)
    saveCover(book, blob)
  }*/
  try {
    const newBook = await book.save()
    console.log("NEW Id: " + newBook.id+ " "+ grbook.Title)
}
catch (er) {
  console.log("error: " + er.message)
  curerrmsg = er.message
    
} 
}

async function getCover(url,isbn){
  const path = `/Users/timomuller/Desktop/mediatekoData/${isbn}.png`
  //const fileStream = fs.createWriteStream(path);
  try{
    await fetch(url, {method:"GET"})
    .then(response => response.buffer())
    .then (blob => writeFileToDisk(blob,path))
  }
  catch(err) {console.log("ERROR: " + err.message)}

  

}

function writeFileToDisk(img,path)
{
  fs.writeFile (
    path,
    img,  // BUG HERE
    (err) => {
        if (err) {
            console.log (`Error `, err);
        }
    }
);
}


function fetchImageFromGoogle(){
  var headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
 console.log("fetching")
  const isbn = document.getElementById('isbn').value
  console.log(isbn)
  const pathToResource = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn
  fetch(pathToResource, {headers:headers, method:"GET"})
  .then(response => response.json())
   .then(json => displayImage(json))
   .catch(err => console.error(err))
}


// Create Book route -
router.post('/', async (req, res) => {
  const book = new Book({
      title: req.body.title,
      //author: req.body.author,
      author: req.body.authorId,
      publishDate: req.body.publishDate,
      readStartDate: new Date(req.body.readStartDate),
      readEndDate: new Date(req.body.readEndDate),
      pageCount: req.body.pageCount,
      description: req.body.description,
      publisher: req.body.publisher,
      isbn: req.body.isbn,
      goodreadsid: req.body.goodreadsid,
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
  console.log("updating")
  console.log("genre: " + req.body.genre)
  let genre = req.body.genre
  if (genre=="Auto") genre="Auto Biography"
  //console.log("REQ: " + JSON.stringify(req.body))
  let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    //book.author = req.body.author //this is actually the authorID
    book.author = req.body.authorId
    book.publishDate = req.body.publishDate
    book.readStartDate = new Date(req.body.readStartDate)
    book.readEndDate = new Date(req.body.readEndDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    book.isbn =  req.body.isbn
    book.goodreadsid = req.body.goodreadsid
    book.genre = req.body.genre
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
    let bookauthor
    console.log("author id: " + book.author)
    const authors = await Author.find({})
    if (form=='edit'){
      bookauthor = await Author.findById(book.author)
    }
    else{
      bookauthor = {name: '', id:''}
      book.readStartDate = new Date()
      book.readEndDate = new Date()
      book.rating = 1
    }
    const params = {
      authors: authors,
      book: book,
      bookauthor: bookauthor,
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
    console.log("renderFormPage error: " + e.message)
    res.redirect('/books')
  }
  
}


function saveCover(book, coverEncoded) {
    console.log("saving cover")
    if (coverEncoded == null) return
    //console.log("coverEncoded: " +coverEncoded)
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }






module.exports = router