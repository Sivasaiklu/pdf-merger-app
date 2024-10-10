import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import './style.css'; 

const PdfMerger = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const mergePdfs = async () => {
    if (files.length === 0) {
      alert("Please select at least two PDF files.");
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'merged.pdf');
  };

  return (

    <div className="pdf-merger">

        <h1>Add Pdf's To Merge</h1>

        <label for="images" class="drop-container" id="dropcontainer">
        <span class="drop-title">Drop files here</span> or
        <input
            type="file" 
            required  
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
        />
       </label>

    <div className="file-list">
        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={mergePdfs}
        disabled={files.length < 2}
        className="merge-button"
      >
        Merge PDFs
      </button>

      <footer className="footer">
        <h3>&copy; {new Date().getFullYear()} Sivasai Nukala. All Rights Reserved.</h3>
      </footer>
      
    </div>
  );
};

export default PdfMerger;
