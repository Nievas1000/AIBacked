const express = require('express')
const router = express.Router()
const doctorsController = require('../controllers/doctors.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', authMiddleware, doctorsController.getAllDoctors)
router.get('/:id', authMiddleware, doctorsController.getDoctorById)
router.post('/', authMiddleware, roleMiddleware(['admin']), doctorsController.createDoctor)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), doctorsController.updateDoctor)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), doctorsController.deleteDoctor)

module.exports = router
