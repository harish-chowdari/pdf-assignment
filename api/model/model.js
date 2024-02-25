const mongoose = require("mongoose");

const pdfFilesSchema = new mongoose.Schema({
    originalPdfUrl:{
        type: String
    },
    newPdfUrl: {
        type: String
    },
    selectedPages: {
        type: [Number] 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("pdfFiles", pdfFilesSchema);
