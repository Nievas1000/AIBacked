const express = require('express')
const router = express.Router()
const patientsController = require('../controllers/patients.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, patientsController.getAllPatients)
router.get('/:phone', authMiddleware, patientsController.getPatientByPhone)
router.post('/', authMiddleware, patientsController.createPatient)
router.put('/:phone', authMiddleware, patientsController.updatePatient)
router.delete('/:phone', authMiddleware, patientsController.deletePatient)

module.exports = router
