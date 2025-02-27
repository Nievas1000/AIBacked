const doctorsService = require('../services/doctors.service')

exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorsService.getAllDoctors()
    res.json(doctors)
  } catch (error) {
    next(error)
  }
}

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorsService.getDoctorById(req.params.id)
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doctor)
  } catch (error) {
    next(error)
  }
}

exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorsService.createDoctor(req.body)
    res.status(201).json(doctor)
  } catch (error) {
    next(error)
  }
}

exports.updateDoctor = async (req, res, next) => {
  try {
    const updatedDoctor = await doctorsService.updateDoctor(req.params.id, req.body)
    res.json(updatedDoctor)
  } catch (error) {
    next(error)
  }
}

exports.deleteDoctor = async (req, res, next) => {
  try {
    await doctorsService.deleteDoctor(req.params.id)
    res.json({ message: 'Doctor deleted successfully' })
  } catch (error) {
    next(error)
  }
}
