const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const validate = require('../middlewares/validate.middleware')
const { registerSchema, loginSchema } = require('../validations/auth.validation')

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.get('/me', authController.getCurrentUser)

module.exports = router
