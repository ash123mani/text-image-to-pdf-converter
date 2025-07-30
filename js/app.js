import {createWorker, RecognizeResult} from 'tesseract.js';
import { jsPDF } from "jspdf";
import { addImageToPage, embedPdf} from "./utils";
import {languages} from "./languages";

const uploader = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');
const pdfContainer = document.getElementById('pdf-container');

let language = localStorage.getItem("language") ?? "eng";

const languageSelect = document.getElementById("language-select");
languages.forEach((lang) => {
  const option = document.createElement("option");
  option.appendChild(document.createTextNode(lang.name));
  option.value = lang.code;
  languageSelect.appendChild(option);
});

languageSelect.value = language;
languageSelect.addEventListener("change", (event) => {
  language = event.target.value;
  localStorage.setItem("language", language);
});


uploader.addEventListener('change', async (event) => {
  const files = event.target.files;

  let doc = new jsPDF();
  let filePromises = [];
  const worker = await createWorker(language);

  fileList.innerHTML = '';
  pdfContainer.innerHTML = '';

  Array.from(files).forEach((file) => {
    const fileItem = addImageToPage(file);
    fileList.appendChild(fileItem);
    filePromises.push(worker.recognize(file))
  });

  await generatePDF(doc, filePromises)
  // Get PDF as data URL
  const pdfDataUrl = doc.output('datauristring');
  embedPdf(pdfDataUrl, pdfContainer);
});






async function generatePDF(doc, workerFiles) {
  const recognizeResults = await Promise.allSettled(workerFiles);

  recognizeResults.forEach((res) => {
    const text = res.value.data.text
    console.log('text', text)
    doc.text(text, 10, 10);
    if (doc.getNumberOfPages() < recognizeResults.length) doc.addPage();
  })
}





