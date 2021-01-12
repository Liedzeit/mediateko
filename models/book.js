const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String
    },
    publisher: { 
        type: String
    },
    genre: { 
        type: String
    },
    originalTitle: { 
        type: String
    },
    readStartDate: {
        type: Date,
        required: false
    },
    readEndDate: { 
        type: Date,
        required: true
    },
    createdAt: { 
        type: Date,
        required: true, 
        default: Date.now
    },
    pageCount: { 
        type: Number, 
        required: true
    },
    isbn: { 
        type: String, 
        required: false
    },
    goodreadsid: { 
        type: Number, 
        required: false
    },
    rating: { 
        type: Number, 
        required: true
    },
    publishDate: { 
        type: String, 
        required: false
    },
    coverImage: { 
         type: Buffer, 
         required: false
    },
    coverImageType: { 
        type: String,
        required: false
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Author'
    
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })

module.exports = mongoose.model('Book', bookSchema)
