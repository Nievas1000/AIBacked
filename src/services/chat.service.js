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
      'http://127.0.0.1:5678/webhook-test/b1da9c1e-0a08-4380-9f7d-0acaaad6f8d7',
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

    return response
  } catch (err) {
    throw new Error('Failed to communicate with AI agent')
  }
}
