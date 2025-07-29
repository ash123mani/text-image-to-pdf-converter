import { createWorker } from 'tesseract.js';

const uploader = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');
const generatedSection = document.querySelector('.generated-section');

const worker = await createWorker('eng');
let text = ""

uploader.addEventListener('change', (event) => {
  const files = event.target.files;
  fileList.innerHTML = ''; // Clear previous list

  Array.from(files).forEach(async (file) => {


    const fileItem = document.createElement('div');
    fileItem.style.marginBottom = '10px';

    const name = document.createElement('strong');
    name.textContent = file.name;
    fileItem.appendChild(name);

    // Preview for images
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '400px';
      img.style.maxHeight = '400px';
      img.style.display = 'block';
      img.style.marginTop = '5px';
      fileItem.appendChild(img);
    }

    // Preview for PDFs
    else if (file.type === 'application/pdf') {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.textContent = 'View PDF';
      link.target = '_blank';
      link.style.display = 'block';
      link.style.marginTop = '5px';
      fileItem.appendChild(link);
    }

    // For other file types (just show name)
    else {
      const info = document.createElement('p');
      info.textContent = `Type: ${file.type || 'Unknown'}`;
      fileItem.appendChild(info);
    }

    fileList.appendChild(fileItem);

    const ret = await worker.recognize(file);
    console.log(ret)
    console.log(ret.data.text);
    text = text + ret.data.text
    generatedSection.innerHTML = `<div>${text}</div>`;
  });
});
