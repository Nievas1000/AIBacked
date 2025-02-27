const express = require('express')
const router = express.Router()
const appointmentsController = require('../controllers/appointments.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, appointmentsController.getAllAppointments)
router.get('/:id', authMiddleware, appointmentsController.getAppointmentById)
router.post('/', authMiddleware, appointmentsController.createAppointment)
router.put('/:id', authMiddleware, appointmentsController.updateAppointment)
router.delete('/:id', authMiddleware, appointmentsController.cancelAppointment)

module.exports = router
