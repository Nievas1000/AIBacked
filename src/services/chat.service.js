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

exports.getConversationById = async (conversationId, userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Conversation not found')
  }
}

exports.sendMessage = async (userId, messageData) => {
  try {
    const newMessage = { ...messageData, user_id: userId }
    const { data, error } = await supabase.from('messages').insert([newMessage]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error sending message')
  }
}
