const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');


const { storage, fileFilter } = require('../uploadPdf/uploadPdf');
const multer = require('multer');
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
});


router.post("/original", upload.single('pdf'), controller.original)


router.post('/extractedPdf', upload.single('pdf'), controller.extractedPdf);


router.get("/pdfs", controller.getPdf)


router.get("/pdf/:id", controller.getOnePdf);




module.exports = router;
