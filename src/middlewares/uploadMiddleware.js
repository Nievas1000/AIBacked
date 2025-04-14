const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo JPG, PNG o WEBP.'))
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    fileFilter
})

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'La imagen no debe superar 1MB.' })
        }
    } else if (err) {
        return res.status(400).json({ message: err.message })
    }
    next()
}

module.exports = { upload, handleMulterError }

