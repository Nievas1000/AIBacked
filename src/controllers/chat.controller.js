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
    const conversation = await chatService.getConversationById(req.params.id)
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' })
    res.json(conversation)
  } catch (error) {
    next(error)
  }
}

exports.webchatMessage = async (req, res, next) => {
  const { id, message, clinicId } = req.body

  if (!id || !message || !clinicId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const response = await chatService.handleWebchatMessage(
      id,
      message,
      clinicId
    )

    res.status(200).json(response.data)
  } catch (error) {
    next(error)
  }
}
