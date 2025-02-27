const express = require('express')
const router = express.Router()
const clinicsController = require('../controllers/clinics.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', authMiddleware, clinicsController.getAllClinics)
router.get('/:id', authMiddleware, clinicsController.getClinicById)
router.post('/', authMiddleware, roleMiddleware(['admin']), clinicsController.createClinic)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), clinicsController.updateClinic)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), clinicsController.deleteClinic)

module.exports = router
