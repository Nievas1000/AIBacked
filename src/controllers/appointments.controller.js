const appointmentsService = require('../services/appointments.service')

exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentsService.getAllAppointments()
    res.json(appointments)
  } catch (error) {
    next(error)
  }
}

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.getAppointmentById(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' })
    res.json(appointment)
  } catch (error) {
    next(error)
  }
}

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.createAppointment(req.body)
    res.status(201).json(appointment)
  } catch (error) {
    next(error)
  }
}

exports.updateAppointment = async (req, res, next) => {
  try {
    const updatedAppointment = await appointmentsService.updateAppointment(req.params.id, req.body)
    res.json(updatedAppointment)
  } catch (error) {
    next(error)
  }
}

exports.cancelAppointment = async (req, res, next) => {
  try {
    await appointmentsService.cancelAppointment(req.params.id)
    res.json({ message: 'Appointment canceled successfully' })
  } catch (error) {
    next(error)
  }
}
