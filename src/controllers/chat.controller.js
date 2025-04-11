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
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

exports.saveChatbotSettings = async (req, res, next) => {
  const { clinicId, settings } = req.body

  if (!clinicId || !settings) {
    return res.status(400).json({ message: 'Missing clinicId or settings' })
  }

  try {
    const response = await chatService.saveSettings(clinicId, settings)
    return res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

exports.getChatbotSettings = async (req, res, next) => {
  const { clinicId } = req.params

  if (!clinicId) {
    return res.status(400).json({ message: 'Missing clinicId' })
  }

  try {
    const response = await chatService.getSettings(clinicId)
    return res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

exports.uploadChatbotAvatar = async (req, res, next) => {
  try {
    const response = await chatService.uploadAvatar(req)
    return res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
