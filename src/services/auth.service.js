const supabase = require('../config/supabase')
const bcrypt = require('bcryptjs')

exports.registerUser = async (name, email, phone, role, password) => {
  try {
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) throw new Error('Email already registered')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ name, email, phone, role, password_hash: hashedPassword }])

    if (error) throw new Error(error.message)

    return data
  } catch (error) {
    throw new Error(`RegisterUser Service Error: ${error.message}`)
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

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) throw new Error('Invalid email or password')

    return user
  } catch (error) {
    throw new Error(`LoginUser Service Error: ${error.message}`)
  }
}
