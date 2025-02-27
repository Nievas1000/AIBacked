const express = require('express')
const router = express.Router()
const faqsController = require('../controllers/faqs.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', faqsController.getAllFAQs)
router.post('/', authMiddleware, roleMiddleware(['admin']), faqsController.createFAQ)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), faqsController.updateFAQ)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), faqsController.deleteFAQ)

module.exports = router
