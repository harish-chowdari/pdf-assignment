
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: "./upload/pdfs",
    filename: function(req,file,cb) {
        cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') 
    {
        cb(null, true)
    } 
    
    else 
    {
        req.fileRejected = true
        cb(null, false)
    }
}




module.exports = {
    storage,
    fileFilter
}