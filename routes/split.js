const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const ejs = require('ejs');
const multer = require('multer');
const JSZip = require('jszip');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
router.get('/', (req, res) => {
    res.render('split');
});
router.post('/split', upload.single('file'), async (req, res) => {
    try {
        const pdfBytes = req.file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numPages = pdfDoc.getPageCount();
        const pageRanges = req.body.pageRanges.split(',');
        const splitPages = [];
        for (const range of pageRanges) {
            const [start, end] = range.split('-').map(Number);
            if (start > end || start < 1 || end > numPages) {
                throw new Error(`Invalid page range: ${range}`);
            }
            splitPages.push({ start: start - 1, end: end - 1 });
        }
        const zip = new JSZip();
        for (const { start, end } of splitPages) {
            const newPdfDoc = await PDFDocument.create();
            for (let i = start; i <= end; i++) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                newPdfDoc.addPage(copiedPage);
            }
            const newPdfBytes = await newPdfDoc.save();
            zip.file(`pages_${start + 1}-${end + 1}.pdf`, newPdfBytes);
        }
        const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });
        const fileName = 'split_pages.zip';
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(zipBytes);
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
