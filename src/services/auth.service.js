const supabase = require('../config/supabase')
const passwordUtils = require('../utils/passwordUtils.js')

exports.registerUser = async (name, email, phone, role, password) => {
  try {
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) throw new Error('Email already registered')

    const hashedPassword = await passwordUtils.hashPassword(password)

    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ name, email, phone, role, password_hash: hashedPassword }])
      .select()

    if (error) throw new Error('Error creating user')

    return data
  } catch (error) {
    throw new Error('Authentication service error')
  }
}

exports.loginUser = async (email, password) => {
  try {
    const { data: user } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) throw new Error('Invalid email or password')

    const isMatch = await passwordUtils.comparePassword(password, user.password_hash)
    if (!isMatch) throw new Error('Invalid email or password')

    return user
  } catch (error) {
    throw new Error('Authentication service error')
  }
}
