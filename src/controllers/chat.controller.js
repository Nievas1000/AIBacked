const chatService = require('../services/chat.service')
require('dotenv').config()

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

exports.uploadAvatar = async (req, res, next) => {
  const { clinicId } = req.body
  const file = req.file

  if (!clinicId || !file) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const url = await chatService.uploadAvatarToStorage(file, clinicId)
    return res.status(200).json({ url })
  } catch (err) {
    next(err)
  }
}

exports.addAllowedDomain = async (req, res, next) => {
  const { clinicId, domain } = req.body
  if (!clinicId || !domain) return res.status(400).json({ message: 'Missing data' })

  try {
    const response = await chatService.addDomain(clinicId, domain)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.getAllowedDomains = async (req, res, next) => {
  const { clinicId } = req.params
  try {
    const response = await chatService.getDomains(clinicId)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.removeAllowedDomain = async (req, res, next) => {
  const { clinicId, domain } = req.params
  try {
    const response = await chatService.deleteDomain(clinicId, domain)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.generateWhatsappQR = async (req, res, next) => {
  const { clientId } = req.body

  if (!clientId) {
    return res.status(400).json({ message: 'Missing clientId' })
  }

  try {
    const data = await chatService.getWhatsappQR(clientId)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

exports.deleteWhatsappInstance = async (req, res, next) => {
  const { instanceId } = req.params

  if (!instanceId) {
    return res.status(400).json({ message: 'Missing instanceId' })
  }

  try {
    const result = await chatService.deleteWhatsappInstance(instanceId)
    res.status(200).json({ message: 'Instance deleted successfully', result })
  } catch (error) {
    console.error('Error deleting WhatsApp instance:', error.message)
    res.status(500).json({ message: 'Failed to delete instance', error: error.message })
  }
}

exports.saveOrUpdateWhatsappInstance = async (req, res, next) => {
  const { clinicId, instanceId, phone, instanceName, state, connectedAt, disconnectedAt } = req.body

  if (!clinicId || !instanceId || !phone || !state) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    const result = await chatService.saveOrUpdateWhatsappInstance({
      clinicId,
      instanceId,
      phone,
      instanceName,
      state,
      connectedAt,
      disconnectedAt
    })

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
