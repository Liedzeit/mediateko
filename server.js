if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const filmRouter = require('./routes/films')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(bodyParser.json());

const { localsName } = require('ejs')


const mongoose = require('mongoose')

url = "mongodb+srv://user:erwin@cluster0.qougs.mongodb.net/mediateko?retryWrites=true&w=majority"

//mongoose.connect(process.env.DATABASE_URL
mongoose.connect(url
    , {
    
useNewUrlParser: true, useUnifiedTopology: true})
console.log("trying to connect to mongoose")
const db = mongoose.connection
db.on('error', error => console.log("mongo Connect error: " + error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/films', filmRouter)










app.listen(process.env.PORT || 3000)

