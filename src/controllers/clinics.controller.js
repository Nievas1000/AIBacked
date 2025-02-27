const clinicsService = require('../services/clinics.service')

exports.getAllClinics = async (req, res, next) => {
  try {
    const clinics = await clinicsService.getAllClinics()
    res.json(clinics)
  } catch (error) {
    next(error)
  }
}

exports.getClinicById = async (req, res, next) => {
  try {
    const clinic = await clinicsService.getClinicById(req.params.id)
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' })
    res.json(clinic)
  } catch (error) {
    next(error)
  }
}

exports.createClinic = async (req, res, next) => {
  try {
    const clinic = await clinicsService.createClinic(req.body)
    res.status(201).json(clinic)
  } catch (error) {
    next(error)
  }
}

exports.updateClinic = async (req, res, next) => {
  try {
    const updatedClinic = await clinicsService.updateClinic(req.params.id, req.body)
    res.json(updatedClinic)
  } catch (error) {
    next(error)
  }
}

exports.deleteClinic = async (req, res, next) => {
  try {
    await clinicsService.deleteClinic(req.params.id)
    res.json({ message: 'Clinic deleted successfully' })
  } catch (error) {
    next(error)
  }
}
