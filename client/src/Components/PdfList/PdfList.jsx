import React from 'react';
import { Document, Page } from 'react-pdf'; 
import Styles from './PdfList.module.css'; 


const PdfList = ({
    pdfContent,
    loading,
    handleCreatePdf,
    pdfCreated,
    downloaded,
    handleDownloadPdf,
    currentPage,
    prevPage,
    nextPage,
    numPages,
    selectedPages,
    handleCheckboxChange,
    onDocumentLoadSuccess
}) => {
    return (
        <div className={Styles.create}>
            <div className={Styles.topelements}>
                <h2>PDF Preview</h2>
                <button
                    className={Styles.createbutton}
                    onClick={handleCreatePdf}
                    disabled={loading}
                >
                    {loading ? 'Creating PDF...' : 'Create PDF'}
                </button>
                {pdfCreated && (
                    <button
                        disabled={downloaded}
                        className={Styles.downloadLink}
                        onClick={handleDownloadPdf} 
                    >
                        Download PDF
                    </button>
                )}

                <div className={Styles.nav}>
                    <button
                        className={Styles.navButton}
                        onClick={prevPage}
                        disabled={currentPage <= 1}
                    >
                        &#8249; 
                    </button>
                    <button
                        className={Styles.navButton}
                        onClick={nextPage}
                        disabled={currentPage >= numPages}
                    >
                        &#8250; 
                    </button>
                </div>
            </div>
            <Document file={pdfContent} onLoadSuccess={onDocumentLoadSuccess}>
                <div className={Styles.page} key={`page_${currentPage}`}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedPages[currentPage]}
                            onChange={() => handleCheckboxChange(currentPage)}
                        />
                        Page {currentPage}
                    </label>
                    <Page
                        key={`page_${currentPage}`}
                        pageNumber={currentPage}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </div>
            </Document>
        </div>
    );
};

export default PdfList;
