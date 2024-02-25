import React, { useState } from 'react'
import Styles from './PdfForm.module.css'
import axios from 'axios'
import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';
import PdfList from '../PdfList/PdfList';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfForm = () => {

    const [downloaded, setDownloaded] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedPages, setSelectedPages] = useState({});
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfContent, setPdfContent] = useState(null);
    const [pdfId, setPdfId] = useState(null);
    const [pdfurl, setPdfUrl] = useState("");
    const [pdfCreated, setPdfCreated] = useState(false);

    const handlePdfChange = (e) => {
        try {
            const pdfFile = e.target.files[0];
            if (pdfFile && pdfFile.type === 'application/pdf') {
                setSelectedPdf(pdfFile);
                setErrorMsg('');
                setSelectedPages({});
            } else {
                setSelectedPdf(null);
                setErrorMsg('Only Pdf files are allowed.');
            }
        } catch(err) {
            console.log(err);
        }
    };

    const handleUploadPdf = async () => {
        try {
            if (selectedPdf) {
                setLoading(true);
                const formData = new FormData();
                formData.append('pdf', selectedPdf);

                const response = await axios.post('http://localhost:4112/api/original', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                alert("PDF Uploaded");
                console.log('PDF uploaded:', response.data);
                setPdfUploaded(true);
                setErrorMsg("");
                const uploadedPdfId = response.data.pdfId;
                setPdfId(uploadedPdfId);
            } else {
                setErrorMsg("Please select a valid PDF file");
            }
        } catch(error) {
            console.error('Error uploading PDF:', error);
            setErrorMsg('Error uploading PDF. Please try again.');
        } finally {
            setLoading(false);
        } 
    };

    const handleShowPdf = async () => {
        try {
            if(pdfUploaded) {
                setLoading(true);
                const response = await axios.get(`http://localhost:4112/api/pdf/${pdfId}`);
                setPdfContent(response.data.originalPdfUrl);
                console.log(pdfContent); 
                setNumPages(response.data.numPages);
                setErrorMsg("");
            } else {
                setErrorMsg("Please upload a pdf to show");
            }
        } catch(error) {
            console.error('Error fetching PDF:', error);
            setErrorMsg('Error fetching PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (pageNumber) => {
        setSelectedPages({
            ...selectedPages,
            [pageNumber]: !selectedPages[pageNumber]
        });
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        const initialSelectedPages = {};
        for (let i = 1; i <= numPages; i++) {
            initialSelectedPages[i] = false;
        }
        setSelectedPages(initialSelectedPages);
    };

    const handleCreatePdf = async () => {
        try {
            setLoading(true);
    
            if (!selectedPdf) {
                setErrorMsg('No PDF file selected.');
                return;
            }
    
            const selectedPagesArr = Object.entries(selectedPages)
                .filter(([_, isSelected]) => isSelected)
                .map(([pageNumber, _]) => parseInt(pageNumber));
    
            if (selectedPagesArr.length === 0) {
                setErrorMsg('No pages selected.');
                return;
            }
    
            const existingPdfBytes = await fetch(URL.createObjectURL(selectedPdf)).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const newPdfDoc = await PDFDocument.create();
    
            for (const pageNumber of selectedPagesArr) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
                newPdfDoc.addPage(copiedPage);
            }
    
            const pdfBytes = await newPdfDoc.save();
            const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    
            setPdfUrl(pdfUrl);
            setPdfCreated(true);
            setErrorMsg('');
            setDownloaded(false)
        } catch (error) {
            console.error('Error creating PDF:', error);
            setErrorMsg('Error creating PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleDownloadPdf = async () => {
        try {
            const selectedPagesArr = Object.entries(selectedPages)
                .filter(([_, isSelected]) => isSelected)
                .map(([pageNumber, _]) => parseInt(pageNumber));
    
            if (selectedPagesArr.length === 0) {
                console.log('No pages selected for download');
                return;
            }
    
            const response = await axios.get(pdfurl, {
                responseType: 'blob' 
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
    
            // Create a new filename indicating the selected pages
            const filename = 'selected_pages.pdf';
            link.setAttribute('download', filename);
            document.body.appendChild(link);
    
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            setDownloaded(true)
        } catch(error) {
            console.error('Error downloading PDF:', error);
        }
    };
    

    return (
        <div className={Styles.container}>
            <h2>Upload PDF</h2>
            <input type="file" onChange={handlePdfChange} />
            {errorMsg && <div className={Styles.error}>{errorMsg}</div>}
            <button onClick={handleUploadPdf}>Upload</button>
            <button onClick={handleShowPdf}>Show PDF</button>
            


            {pdfContent && <PdfList
                pdfContent={pdfContent}
                loading={loading}
                handleCreatePdf={handleCreatePdf}
                pdfCreated={pdfCreated}
                downloaded={downloaded}
                handleDownloadPdf={handleDownloadPdf}
                currentPage={currentPage}
                prevPage={prevPage}
                nextPage={nextPage}
                numPages={numPages}
                selectedPages={selectedPages}
                handleCheckboxChange={handleCheckboxChange}
                onDocumentLoadSuccess={onDocumentLoadSuccess}
            />}



        </div>
    );
};

export default PdfForm;
