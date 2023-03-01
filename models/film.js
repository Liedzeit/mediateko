const mongoose = require('mongoose')

const filmSchema = new mongoose.Schema({
    num: { 
        type: String, 
        required: false
    },
    Title: { 
        type: String, 
        required: true
    },
    Year: { 
        type: String
    },
    Rated: { 
        type: String,
        required: false
    },
    Released: { 
        type: String
    },
    Runtime: { 
        type: String,
        required: false
    },
    Genre: {
        type: String,
        required: true
    },
    Director: { 
        type: String,
        required: true
    },
    Writer: { 
        type: String,
        required: false
    },
    Actors: { 
        type: String, 
        required: true
    },
    Plot: { 
        type: String,
        required: false
    },
    Language: { 
        type: String, 
        required: false
    },
    Country: { 
        type: String,  
        required: true
    },
    Awards: { 
        type: String, 
        required: false
    },
    Poster: { 
         type: String, 
         required: false
    },
    imdbRating: { 
        type: String, 
        required: false
   },
   myReview: { 
    type: String, 
    required: false
    },
    myRating: { 
        type: String, 
        required: false
    },
    imdbID: { 
        type: String, 
        required: false
    },
   BoxOffice: { 
    type: String, 
    required: false
    },
    Medium: { 
        type: String, 
        required: false
    },
    WatchDate: {
        type: Date,
        required: false
    },


})

/*filmSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })*/

module.exports = mongoose.model('Film', filmSchema)