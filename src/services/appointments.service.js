const supabase = require('../config/supabase')

exports.getAllAppointments = async () => {
  try {
    const { data, error } = await supabase.from('appointments').select('*')
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving appointments')
  }
}

exports.getAppointmentById = async (id) => {
  try {
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Appointment not found')
  }
}

exports.createAppointment = async (appointmentData) => {
  try {
    const { data, error } = await supabase.from('appointments').insert([appointmentData]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error creating appointment')
  }
}

exports.updateAppointment = async (id, appointmentData) => {
  try {
    const { data, error } = await supabase.from('appointments').update(appointmentData).eq('id', id).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error updating appointment')
  }
}

exports.cancelAppointment = async (id) => {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) throw new Error()
  } catch (error) {
    throw new Error('Error canceling appointment')
  }
}
