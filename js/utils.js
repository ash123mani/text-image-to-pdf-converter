export function embedPdf(pdfDataUrl, domEle) {
  const embed = document.createElement('embed');
  embed.src = pdfDataUrl;
  embed.type = 'application/pdf';
  embed.width = '100%';
  embed.height = '100%';

  // Add to container
  domEle.appendChild(embed);
}


export function addImageToPage(file) {
  const fileItem = document.createElement('div');
  fileItem.style.marginBottom = '10px';

  // const name = document.createElement('strong');
  // name.textContent = file.name;
  // fileItem.appendChild(name);

  // Preview for images
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '600px';
    img.style.maxHeight = '600px';
    img.style.display = 'block';
    fileItem.appendChild(img);
  } else {   // For other file types (just show name)
    const info = document.createElement('p');
    info.textContent = `Type: ${file.type || 'Unknown'}`;
    fileItem.appendChild(info);
  }

  return fileItem;
}
