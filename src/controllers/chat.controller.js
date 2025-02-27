const chatService = require('../services/chat.service')

exports.getAllConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getAllConversations(req.user.id)
    res.json(conversations)
  } catch (error) {
    next(error)
  }
}

exports.getConversationById = async (req, res, next) => {
  try {
    const conversation = await chatService.getConversationById(req.params.id, req.user.id)
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' })
    res.json(conversation)
  } catch (error) {
    next(error)
  }
}

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await chatService.sendMessage(req.user.id, req.body)
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }
}
