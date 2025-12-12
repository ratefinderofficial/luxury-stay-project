/**
 * Triggers the browser print dialog.
 * Ideally, use CSS media query `@media print` to hide sidebar/buttons.
 */
export const printWindow = () => {
  window.print();
};

/**
 * Downloads JSON data as a text file (Useful for debugging or data export)
 * @param {Object} data - The data to export
 * @param {String} filename - Name of the file
 */
export const downloadJSON = (data, filename = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Opens a PDF Blob URL in a new tab (Used for Billing API response)
 * @param {Blob} pdfBlob 
 */
export const openPdfInNewTab = (pdfBlob) => {
  const url = window.URL.createObjectURL(new Blob([pdfBlob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Invoice_${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};