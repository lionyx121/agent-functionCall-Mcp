const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router()

router.get('/', (req, res) => {
    console.log('API_KEY:', process.env.API_KEY)
    res.send('连接成功')
})

module.exports = router;
