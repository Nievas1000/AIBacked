const supabase = require('../config/supabase')

exports.getAllPatients = async () => {
  try {
    const { data, error } = await supabase.from('patients').select('*')
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving patients')
  }
}

exports.getPatientByPhone = async (phone) => {
  try {
    const { data, error } = await supabase.from('patients').select('*').eq('phone', phone).single()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Patient not found')
  }
}

exports.createPatient = async (patientData) => {
  try {
    const { data, error } = await supabase.from('patients').insert([patientData]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error creating patient')
  }
}

exports.updatePatient = async (phone, patientData) => {
  try {
    const { data, error } = await supabase.from('patients').update(patientData).eq('phone', phone).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error updating patient')
  }
}

exports.deletePatient = async (phone) => {
  try {
    const { error } = await supabase.from('patients').delete().eq('phone', phone)
    if (error) throw new Error()
  } catch (error) {
    throw new Error('Error deleting patient')
  }
}
