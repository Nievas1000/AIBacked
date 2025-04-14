const { default: axios } = require('axios')
const supabase = require('../config/supabase')

exports.getAllConversations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving conversations')
  }
}

exports.getConversationById = async (conversationId) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error('Error fetching conversation messages')
  }

  return messages
}

exports.handleWebchatMessage = async (patientId, message, clinicPhone, isBot = false) => {
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('phone', clinicPhone)
    .single()

  if (clinicError || !clinic) {
    throw new Error('Clinic not found or DB error')
  }

  const clinicId = clinic.id

  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()

  if (patientError || !patient) {
    const { error: createPatientError } = await supabase
      .from('patients')
      .insert([
        {
          id: patientId,
          created_at: new Date().toISOString()
        }
      ])

    if (createPatientError) {
      throw new Error('Failed to create patient')
    }
  }

  let { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('patient_id', patientId)
    .eq('channel', 'webchat')
    .single()

  if (conversationError || !conversation) {
    const { data: newConversation, error: createConvError } =
      await supabase
        .from('conversations')
        .insert([
          {
            clinic_id: clinicId,
            patient_id: patientId,
            channel: 'webchat',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

    if (createConvError) {
      throw new Error('Failed to create conversation')
    }

    conversation = newConversation
  }

  const sender = isBot ? 'bot' : 'patient'

  const { error: patientMsgError } = await supabase.from('messages').insert([
    {
      clinic_id: clinicId,
      session_id: conversation.id,
      sender,
      message,
      origin: 'webchat'
    }
  ])

  if (patientMsgError) throw new Error('Error saving patient message')

  if (isBot) {
    const messageObject = {
      type: 'ai',
      content: message,
      tool_calls: [],
      additional_kwargs: {},
      response_metadata: {},
      invalid_tool_calls: []
    }

    const { error: historyError } = await supabase
      .from('n8n_chat_histories')
      .insert([
        {
          session_id: conversation.id,
          message: messageObject
        }
      ])

    if (historyError) throw new Error('Error saving welcome message to chat history')

    return {
      data: message,
      conversationId: conversation.id
    }
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:5678/webhook/b1da9c1e-0a08-4380-9f7d-0acaaad6f8d7',
      {
        patient_id: patientId,
        clinic_id: clinicId,
        message,
        source: 'webchat',
        sessionId: conversation.id
      }
    )

    if (!response || !response.data) {
      throw new Error('Invalid AI response')
    }

    const { error: botMsgError } = await supabase.from('messages').insert([
      {
        clinic_id: clinicId,
        session_id: conversation.id,
        sender: 'bot',
        message: response.data.data,
        origin: 'webchat'
      }
    ])

    if (botMsgError) throw new Error('Error saving bot response')

    return {
      data: response.data.data,
      conversationId: conversation.id
    }
  } catch (err) {
    throw new Error('Failed to communicate with AI agent')
  }
}

exports.saveSettings = async (clinicId, settings) => {
  const { data, error } = await supabase
    .from('chatbot_settings')
    .upsert({ clinic_id: clinicId, settings }, { onConflict: 'clinic_id' })
    .select()
    .single()

  if (error) throw new Error('Failed to save chatbot settings')
  return data
}

exports.getSettings = async (clinicId) => {
  const { data, error } = await supabase
    .from('chatbot_settings')
    .select('settings')
    .eq('clinic_id', clinicId)
    .single()

  if (error || !data) throw new Error('No settings found for clinic')
  return data
}

exports.uploadAvatarToStorage = async (file, clinicId) => {
  const buffer = file.buffer
  const fileExt = file.originalname.split('.').pop()
  const fileName = `${clinicId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from('chatbot-assets')
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: true // 🧽 reemplaza si ya existe
    })

  if (error) throw new Error('Error uploading file to storage')

  const { data: publicUrl } = supabase
    .storage
    .from('chatbot-assets')
    .getPublicUrl(fileName)

  return publicUrl.publicUrl
}

exports.addDomain = async (clinicId, domain) => {
  const { data, error } = await supabase
    .from('chatbot_allowed_domains')
    .insert([{ clinic_id: clinicId, domain }])

  if (error) throw new Error('Error adding domain')
  return data
}

exports.getDomains = async (clinicId) => {
  const { data, error } = await supabase
    .from('chatbot_allowed_domains')
    .select('domain')
    .eq('clinic_id', clinicId)

  if (error) throw new Error('Error fetching domains')
  return data[0]
}

exports.deleteDomain = async (clinicId, domain) => {
  const { error } = await supabase
    .from('chatbot_allowed_domains')
    .delete()
    .eq('clinic_id', clinicId)
    .eq('domain', domain)

  if (error) throw new Error('Error deleting domain')
  return { success: true }
}
