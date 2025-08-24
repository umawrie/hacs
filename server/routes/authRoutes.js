const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, getUserData } = require('../controllers/authController')

router.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/', loginUser)
router.get('/userData', getUserData)

module.exports = router