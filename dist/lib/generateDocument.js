"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const uploadToS3_1 = require("./helpers/uploadToS3");
const puppeteer = require("puppeteer-core");
const Mustache = require("mustache");
const moment = require("moment");
const calculateTotal_1 = require("./helpers/calculateTotal");
const generateDocument = async (documentType, transaction, awsConfig) => {
    try {
        // Check if the documentType is valid
        (!fs.existsSync(`./lib/templates/${documentType}/index.html`)) ? (function () { throw new Error('Template not found'); }()) : null;
        //
        // Adapt input data to interface
        const transactionData = transaction;
        //
        // Verify if the workshop logo exists and if not, use the default one
        if (!transactionData.workshop.logo_url) {
            transactionData.workshop.logo_url =
                'https://mitallerapp-documents.s3.us-west-1.amazonaws.com/logos/mitaller-logo.png';
        }
        ;
        //
        // Read the index.html template and fill it with the provided transaction data
        fs.readFile(`./lib/templates/${documentType}/index.html`, async (err, fileBuffer) => {
            if (err) {
                throw new Error(err.message);
            }
            const totalPrice = (0, calculateTotal_1.default)(transactionData.details);
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const htmlTemplate = fileBuffer.toString();
            const formatedHTML = Mustache.render(htmlTemplate, { date: moment().format('D/MM/YYYY'),
                totalPrice,
                ...transactionData });
            await page.setContent(formatedHTML);
            await page.addStyleTag({ path: `./lib/templates/${documentType}/styles.css` });
            await page.pdf({
                format: 'A4',
                printBackground: false,
                margin: {
                    top: '1px',
                    bottom: '1px',
                    left: '1px',
                    right: '1px',
                },
            }).then(async (pdf) => {
                await (0, uploadToS3_1.uploadToS3)(pdf, transaction.id, documentType, awsConfig).then((fileUrl) => {
                    browser.close();
                    return { ok: true, error: null, documentUrl: fileUrl };
                });
            });
        });
        //
        throw new Error('Error generating PDF');
    }
    catch (error) {
        return { ok: false, error: error, documentUrl: null };
    }
};
exports.default = generateDocument;
