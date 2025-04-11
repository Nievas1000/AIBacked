const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/uploadMiddleware')

router.get('/conversations', authMiddleware, chatController.getAllConversations)
router.get('/conversations/:id', chatController.getConversationById)
router.post('/webchat/messages', chatController.webchatMessage)
router.get('/settings/:clinicId', chatController.getChatbotSettings)
router.post('/settings', chatController.saveChatbotSettings)
router.post('/upload-avatar', upload.single('file'), chatController.uploadChatbotAvatar)

module.exports = router
