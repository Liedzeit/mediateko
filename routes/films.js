const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const Film = require('../models/film')

const genres=["--","Science Fiction","Superhero","Western","Film-Noir","Comedy","Drama","Action","Horror","War","Bond","Wallace","Oscar","Silent"]
   


// All Films Route
router.get('/', async (req, res) => {
try{
  let searchOptions = {}
  let sortOptions = [{Title:1},{Title:-1},{Year:1},{Year:-1}]
  let sort, dir
  let sortIndex = 0
  console.log("received films request: sortindex: " + sortIndex)
  if (req.query.sortfilms != null && req.query.sortfilms !== '') {
    sort = req.query.sortfilms
    dir = req.query.sortdirfilms
    console.log("sortdir: " + dir+ " val  "+ sort)
    if (sort == "Title"){
      if (dir == "up"){
        sortIndex = 0
      }
      else{
        sortIndex = 1
      }
    }else{
      if (dir == "up"){
      sortIndex = 2
      }
      else{
        sortIndex = 3
      }
    }
    console.log("SORTINDEX: " +sortIndex)
  }
  //searchOptions.Medium="DVD"

  const films = await Film.find(searchOptions).sort(sortOptions[sortIndex])

  //const films = await Film.find()

 
    res.render('films/index', {
      films: films,
      sortIndex: sortIndex,
      genres:genres,
      searchOptions: req.query
    })
  } catch {
    console.log("ERROR")
    res.redirect('/')
  }
  //console.log("sortOptions name: " + sortOptions.sortfilms)

})

router.get('/search', async (req, res) => {
  try {
    console.log("received search request")
    console.log("received: " + JSON.stringify(req.query))
    let s
    let test
    if (req.query != null && req.query !== '') {
      s = req.query.Title;
      let genre = req.query.genre
      let director = req.query.Director
      let actors = req.query.Actors
      if (actors == ""){
        actors = ".*"
       }
      if (director == ""){
        director = ".*"
       }
       if (s == ""){
        s = ".*"
       }
       if (genre == "--"){
        genre = ".*"
       }
       
       console.log("received request for director " + director)
    
    console.log(test)
    let searchOptions = {"Title":{$regex: s},"Genre":{$regex: genre},"Director":{$regex: director},"Actors":{$regex: actors}}
    //searchOptions.Medium = "DVD"
    const films = await Film.find(searchOptions)

    let sortOptions = [{Title:1},{Year:1},{Year:-1}]
    let sortIndex=0
    res.render('films/index', {
      films: films,
      sortIndex: sortIndex,
      genres:genres,
      searchOptions:req.query
    })
  }
  } catch(e) {
    console.log("ERROR" + e.message)
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', async (req, res) => {
   console.log(req.query)
    if (Object.keys(req.query).length === 0){
    console.log("no request")
      res.render('films/new', { })
      return
    }
  let mid = req.query.imdbid
  let title = req.query.title
  if (mid != undefined && mid != ''){
    console.log("mid defined " + mid)
    //let movie = getMovie(mid)

    let resp = await fetch(`https://www.omdbapi.com/?i=${mid}&apikey=fc7bd51`)
    let json = await resp.json()
    console.log(json)
    console.log(json.Title)
    json.WatchDate = new Date()

    const film = new Film(json)

    try {
      const newFilm = await film.save()
      console.log("NEW Id: " + newFilm.id)
      res.redirect(`/films/${newFilm._id}`)
      }
      catch (er) {
        console.log("error: " + er.message)
        curerrmsg = er.message
    } 
  }
  else{
    console.log ("searching for title " + title)
    if (title != ''){
      console.log(`https://www.omdbapi.com/?t=${title}&apikey=fc7bd51`)
      try{
      let resp = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=fc7bd51`)
      let json = await resp.json()
      console.log("json " + JSON.stringify(json))
      if (json.Response == "False"){
        console.log("not found")
      }
      else{
        json.WatchDate = new Date()

        const film = new Film(json)

        try {
          const newFilm = await film.save()
          console.log("NEW Id: " + newFilm.id)
          res.redirect(`/films/${newFilm._id}`)
          }
          catch (er) {
            console.log("error: " + er.message)
            curerrmsg = er.message
            res.render('films/new', { })
        } 
      }
      }
      catch(e){
        console.log("Error")
        res.render('films/new', { })
      }
      
      
      
      
    }
    
  }


   
  
})



router.get('/:id', async (req, res) => {
  try {
    const film = await Film.findById(req.params.id)
    res.render('films/show', { film: film })
  } catch {
    res.redirect('/')
  }
})




router.get('/:id/edit', async (req, res) => {
  try {
    const film = await Film.findById(req.params.id).sort({ orderIndex: -1 })
    res.render('films/edit', { film: film })
  } catch {
    res.redirect('/films')
  }
})

// Update Film Route
router.put('/:id', async (req, res) => {
  console.log("updating Film")
  console.log("actors: " + req.body.actors)
  console.log("rating: " + req.body.rating)
  console.log("Title: " + req.body.title)
  console.log("Genre: " + req.body.genre)
  console.log("ID: " + req.params.id)
 
  let film
  try {
    film = await Film.findById(req.params.id)
    film.Title = req.body.title
    //book.author = req.body.author //this is actually the authorID
    film.Director = req.body.director
    film.Actors = req.body.actors
    film.myReview = req.body.myReview
    film.myRating = req.body.rating
    film.Genre = req.body.genre
    console.log("WD: " + req.body.watchDate)
    if (req.body.watchDate != null && req.body.watchDate.length>0 ){
       try{
        let d = req.body.watchDate
        film.WatchDate = new Date(d)
       }
       catch(e){
        console.log("date error 1")
       }
    }
    else{
      console.log("error date")
    }
    film.Medium = req.body.medium
    
     await film.save()
    res.redirect(`/films/${film._id}`)
  } catch (er){
    curerrmsg = "update error: "  + er.message

    console.log("update error: " + er.message)
    if (film != null) {
      redirect('/films')
    } else {
      redirect('/')
    }
  }
})

router.delete('/:id', async (req, res) => {
  console.log("DELETE FILM" + req.params.id)
  
})


function getMovieById(movieId) {
  return fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=fc7bd51`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

module.exports = router