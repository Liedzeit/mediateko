const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    //res.send('Hello World and Earthlings')
    res.render('index')
})

module.exports = router