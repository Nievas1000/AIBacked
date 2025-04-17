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

exports.handleWebchatMessage = async (patientId, message, clinicPhone) => {
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('phone', clinicPhone)
    .single()

  if (clinicError || !clinic) {
    throw new Error('Clinic not found or DB error')
  }

  const clinicId = clinic.id

  const { data: settingsData, error: settingsError } = await supabase
    .from('chatbot_settings')
    .select('settings')
    .eq('clinic_id', clinicPhone)
    .single()

  if (settingsError || !settingsData) {
    throw new Error('Failed to load chatbot settings')
  }

  const welcomeMessage = settingsData.settings?.welcomeMessage || null

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

  const { error: patientMsgError } = await supabase.from('messages').insert([
    {
      clinic_id: clinicId,
      session_id: conversation.id,
      sender: 'patient',
      message,
      origin: 'webchat'
    }
  ])
  if (patientMsgError) throw new Error('Error saving patient message')

  try {
    const response = await axios.post(
      'http://127.0.0.1:5678/webhook/b1da9c1e-0a08-4380-9f7d-0acaaad6f8d7',
      {
        patient_id: patientId,
        clinic_id: clinicId,
        message,
        source: 'webchat',
        sessionId: conversation.id,
        welcomeMessage
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
    console.log(err)
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

exports.getWhatsappQR = async (clientId) => {
  try {
    const responseCreate = await axios.post(
      `${process.env.EVOLUTION_API_URL}/instance/create`,
      {
        instanceName: `client-${clientId}`,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        websocket_enabled: true,
        websocket_events: ['QRCODE_UPDATED', 'CONNECTION_UPDATE']
      },
      {
        headers: {
          apikey: process.env.EVOLUTION_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    const base64 = responseCreate.data?.qrcode?.base64
    const instanceId = responseCreate.data?.instance?.instanceId
    const instanceName = responseCreate.data?.instance?.instanceName

    if (!base64 || !instanceId || !instanceName) {
      throw new Error('QR code not returned from Evolution API')
    }

    return {
      instanceId,
      instanceName,
      qr: base64
    }
  } catch (error) {
    console.error('Error fetching WhatsApp QR:', error.message)
    throw new Error('Failed to retrieve QR code')
  }
}

exports.deleteWhatsappInstance = async (instanceId) => {
  const url = `${process.env.EVOLUTION_API_URL}/instance/delete/${instanceId}`

  const response = await axios.delete(url, {
    headers: {
      apikey: process.env.EVOLUTION_API_KEY
    }
  })

  return response.data
}

exports.saveOrUpdateWhatsappInstance = async ({ clinicId, instanceId, phone, instanceName, state, connectedAt, disconnectedAt }) => {
  const { data: existing, error: findError } = await supabase
    .from('whatsapp_instances')
    .select('*')
    .eq('clinic_id', clinicId)
    .single()

  if (findError && findError.code !== 'PGRST116') {
    throw new Error('Error buscando instancia existente')
  }

  if (existing) {
    const { data, error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({
        instance_id: instanceId,
        phone,
        instance_name: instanceName,
        state,
        connected_at: connectedAt,
        disconnected_at: disconnectedAt
      })
      .eq('clinic_id', clinicId)
      .select()
      .single()

    if (updateError) throw new Error('Error actualizando instancia')

    return data
  } else {
    const { data, error: insertError } = await supabase
      .from('whatsapp_instances')
      .insert([{
        clinic_id: clinicId,
        instance_id: instanceId,
        phone,
        instance_name: instanceName,
        state,
        connected_at: connectedAt,
        disconnected_at: disconnectedAt
      }])
      .select()
      .single()

    if (insertError) throw new Error('Error insertando nueva instancia')

    return data
  }
}
