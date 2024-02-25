const { PDFDocument } = require('pdf-lib');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const port = 4112;
const pdfFiles = require("../model/model");




async function original(req, res) {
    try {
        if (req.fileRejected) {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const pdfUrl = `http://localhost:${port}/pdfs/${req.file.filename}`;

        const pdf = new pdfFiles({
            originalPdfUrl:pdfUrl
        })

        await pdf.save()
        const pdfId = pdf._id;

        return res.status(200).json({
            success: true,
            originalPdfUrl: pdfUrl,
            pdfId:pdfId
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}




async function extractedPdf(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const selectedPages = JSON.parse(req.body.selectedPages);
        const pdfUrl = `http://localhost:${port}/pdfs/${req.file.filename}`;

        const originalPdfBytes = fs.readFileSync(req.file.path);
        const originalPdf = await PDFDocument.load(originalPdfBytes);
        const mergedPdf = await PDFDocument.create();

        for (const pageNumber of selectedPages) {
            const [copiedPage] = await mergedPdf.copyPages(originalPdf, [pageNumber - 1]);
            mergedPdf.addPage(copiedPage);
        }

        const newPdfFileName = `selected_pages_${uuidv4()}.pdf`;
        const newPdfPath = `./upload/pdfs/${newPdfFileName}`;
        const newPdfBytes = await mergedPdf.save();

        fs.writeFileSync(newPdfPath, newPdfBytes);

        const newPdfUrl = `http://localhost:${port}/pdfs/${newPdfFileName}`;



        const pdf = new pdfFiles({
            newPdfUrl: newPdfUrl,
            selectedPages: selectedPages
        });

        await pdf.save();

        return res.json({
            success: true,
            newPdfUrl: newPdfUrl
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}




async function getPdf(req, res) {
    try {
        const allPdfs = await pdfFiles.find();
        res.json(allPdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function getOnePdf(req, res) {
    try {
        const pdf = await pdfFiles.findById(req.params.id); // Make sure to use the correct parameter name for the ID
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        res.json(pdf);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}








module.exports = {
    original,
    getPdf,
    extractedPdf,
    
    getOnePdf
};
