const express = require('express')
const router = express.Router()
const Author = require('../models/author')


// All authors route
router.get('/', async (req, res) => {
    console.log("getting request")
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
   try {
       const authors = await Author.find(searchOptions)
       console.log("found something")
       res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
   } catch{
    console.log("redirecting")
    res.redirect('/')
   }
})

// new author route
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author()})
})

// Create Author route
router.post('/', async (req, res) => {
    console.log("new author: " + req.body.name)
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors`)
    } catch {
        console.log("Error creating new author")
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
    
})

module.exports = router