const faqsService = require('../services/faqs.service')

exports.getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await faqsService.getAllFAQs()
    res.json(faqs)
  } catch (error) {
    next(error)
  }
}

exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await faqsService.createFAQ(req.body)
    res.status(201).json(faq)
  } catch (error) {
    next(error)
  }
}

exports.updateFAQ = async (req, res, next) => {
  try {
    const updatedFAQ = await faqsService.updateFAQ(req.params.id, req.body)
    res.json(updatedFAQ)
  } catch (error) {
    next(error)
  }
}

exports.deleteFAQ = async (req, res, next) => {
  try {
    await faqsService.deleteFAQ(req.params.id)
    res.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    next(error)
  }
}
