const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');

/**
 * Compile HTML Template with Data
 */
const compileTemplate = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'templates', 'pdfs', `${templateName}.html`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

/**
 * Generate PDF Buffer
 * @param {String} templateName - Filename in templates/pdfs
 * @param {Object} data - Invoice Data
 * @returns {Buffer} PDF Buffer
 */
const generatePdf = async (templateName, data) => {
    try {
        // 1. Browser launch karein
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox'] // Required for some server environments
        });
        
        const page = await browser.newPage();

        // 2. HTML Compile karein
        const content = await compileTemplate(templateName, data);

        // 3. Page content set karein
        await page.setContent(content, { waitUntil: 'networkidle0' });

        // 4. PDF create karein
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Colors print karne ke liye zaroori hai
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        console.error('❌ PDF Generation Error:', error);
        throw new Error('Failed to generate PDF');
    }
};

module.exports = { generatePdf };