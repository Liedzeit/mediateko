const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    description: { 
        type: String
    },
    publishDate: { 
        type: String, 
        required: true
    },
    readStartDate: { 
        type: String
    },
    readEndDate: { 
        type: String
    },
    createdAt: { 
        type: String, 
        required: true, 
        default: Date.now
    },
    pageCount: { 
        type: Number, 
        required: true
    },
    publishDate: { 
        type: String, 
        required: true, 
        default: Date.now
    },
    coverImage: { 
         type: Buffer, 
         required: true
    },
    coverImageType: { 
        type: String,
        required: true
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
