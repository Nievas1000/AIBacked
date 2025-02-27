const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/conversations', authMiddleware, chatController.getAllConversations)
router.get('/conversations/:id', authMiddleware, chatController.getConversationById)
router.post('/messages', authMiddleware, chatController.sendMessage)

module.exports = router
