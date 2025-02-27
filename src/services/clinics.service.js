const supabase = require('../config/supabase')

exports.getAllClinics = async () => {
  try {
    const { data, error } = await supabase.from('clinics').select('*')
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving clinics')
  }
}

exports.getClinicById = async (id) => {
  try {
    const { data, error } = await supabase.from('clinics').select('*').eq('id', id).single()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Clinic not found')
  }
}

exports.createClinic = async (clinicData) => {
  try {
    const { data, error } = await supabase.from('clinics').insert([clinicData]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error creating clinic')
  }
}

exports.updateClinic = async (id, clinicData) => {
  try {
    const { data, error } = await supabase.from('clinics').update(clinicData).eq('id', id).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error updating clinic')
  }
}

exports.deleteClinic = async (id) => {
  try {
    const { error } = await supabase.from('clinics').delete().eq('id', id)
    if (error) throw new Error()
  } catch (error) {
    throw new Error('Error deleting clinic')
  }
}
