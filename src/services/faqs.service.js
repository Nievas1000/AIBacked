const supabase = require('../config/supabase')

exports.getAllFAQs = async () => {
  try {
    const { data, error } = await supabase.from('faqs').select('*')
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving FAQs')
  }
}

exports.createFAQ = async (faqData) => {
  try {
    const { data, error } = await supabase.from('faqs').insert([faqData]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error creating FAQ')
  }
}

exports.updateFAQ = async (id, faqData) => {
  try {
    const { data, error } = await supabase.from('faqs').update(faqData).eq('id', id).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error updating FAQ')
  }
}

exports.deleteFAQ = async (id) => {
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) throw new Error()
  } catch (error) {
    throw new Error('Error deleting FAQ')
  }
}
