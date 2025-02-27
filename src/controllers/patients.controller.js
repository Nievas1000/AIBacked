const patientsService = require('../services/patients.service')

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await patientsService.getAllPatients()
    res.json(patients)
  } catch (error) {
    next(error)
  }
}

exports.getPatientByPhone = async (req, res, next) => {
  try {
    const patient = await patientsService.getPatientByPhone(req.params.phone)
    if (!patient) return res.status(404).json({ message: 'Patient not found' })
    res.json(patient)
  } catch (error) {
    next(error)
  }
}

exports.createPatient = async (req, res, next) => {
  try {
    const patient = await patientsService.createPatient(req.body)
    res.status(201).json(patient)
  } catch (error) {
    next(error)
  }
}

exports.updatePatient = async (req, res, next) => {
  try {
    const updatedPatient = await patientsService.updatePatient(req.params.phone, req.body)
    res.json(updatedPatient)
  } catch (error) {
    next(error)
  }
}

exports.deletePatient = async (req, res, next) => {
  try {
    await patientsService.deletePatient(req.params.phone)
    res.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    next(error)
  }
}
