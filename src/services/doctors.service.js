const supabase = require('../config/supabase')

exports.getAllDoctors = async () => {
  try {
    const { data, error } = await supabase.from('doctors').select('*')
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error retrieving doctors')
  }
}

exports.getDoctorById = async (id) => {
  try {
    const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Doctor not found')
  }
}

exports.createDoctor = async (doctorData) => {
  try {
    const { data, error } = await supabase.from('doctors').insert([doctorData]).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error creating doctor')
  }
}

exports.updateDoctor = async (id, doctorData) => {
  try {
    const { data, error } = await supabase.from('doctors').update(doctorData).eq('id', id).select()
    if (error) throw new Error()
    return data
  } catch (error) {
    throw new Error('Error updating doctor')
  }
}

exports.deleteDoctor = async (id) => {
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id)
    if (error) throw new Error()
  } catch (error) {
    throw new Error('Error deleting doctor')
  }
}
