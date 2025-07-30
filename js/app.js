import {createWorker, RecognizeResult} from 'tesseract.js';
import { jsPDF } from "jspdf";
import { addImageToPage, embedPdf} from "./utils";

const uploader = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');

const doc = new jsPDF();
const worker = await createWorker('eng');
const filePromises = [];





uploader.addEventListener('change', async (event) => {
  const files = event.target.files;
  fileList.innerHTML = '';

  Array.from(files).forEach((file) => {
    const fileItem = addImageToPage(file);
    fileList.appendChild(fileItem);
    filePromises.push(worker.recognize(file))
  });

  await generatePDF()
  // Get PDF as data URL
  const pdfDataUrl = doc.output('datauristring');
  embedPdf(pdfDataUrl, document.getElementById('pdf-container'));
});






async function generatePDF() {
  const recognizeResults = await Promise.allSettled(filePromises);

  recognizeResults.forEach((res) => {
    const text = res.value.data.text
    doc.text(text, 10, 10);
    if (doc.getNumberOfPages() < recognizeResults.length) doc.addPage();
  })
}





