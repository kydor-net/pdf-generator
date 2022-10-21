# Workshop PDF Generator
PDF Generator for workshop orders, relying on [Puppeteers](https://www.npmjs.com/package/puppeteer) and [Mustache](https://www.npmjs.com/package/mustache) to generate PDFs from HTML templates.

This packages takes input data in `JSON` format, generates a PDF Buffer, uploads it to AWS S3 and returns a signed URL to the PDF.

## Usage
### Installation
```bash
npm i @kydor-net/workshop-pdf-generator
```

### Setup
```javascript
const PDFGenerator = require('@kydor-net/workshop-pdf-generator');

const awsCredentials = {
    accessKeyId: 'AWS_ACCESS_KEY_ID',
    secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    region: 'AWS_REGION',
    bucket: 'AWS_BUCKET',
};

const pdfGenerator = new PDFGenerator(awsCredentials);
```

### Usage
```javascript
const pdfResult = await PDFGenerator.generatePDF(
    // 'workshopOrder' is the only supported document type at the moment
    'workshopOrder',
    {
        // General data for the document generation
        id: 'example-workshop-uuid',
        workshop: {
            logo_url: 'WORKSHOP LOGO URL', // optional
            name: 'WORKSHOP NAME',
            address: 'WORKSHOP ADDRESS',
            city: 'WORKSHOP CITY', // optional
            phone: 'WORKSHOP PHONE', // optional
            email: 'WORKSHOP EMAIL' // optional
        },
        workshopCar: {
            // Car data
            plate: 'CAR PLATE',
            vin: 'CAR VIN', // optional
            type: 'CAR TYPE',
            model: 'CAR MODEL',
            year: 2020,
            color: 'CAR COLOR',
            brand: 'CAR BRAND',
            km: 12000, // optional
            fuel: 'YOUR FUEL FORMAT' // optional
        },
        contact: {
            // Contact data
            name: 'CONTACT NAME',
            email: 'CONTACT EMAIL', // optional
            rut: 'CONTACT RUT', // optional
            phone: 'CONTACT PHONE'
        },
        details: [
            // List of details
            {
                text: 'DETAIL TEXT EXAMPLE 1',
                price: 10000
            },
            {
                text: 'DETAIL TEXT EXAMPLE 2',
                price: 20000
            }
        ] // send a empty list if you don't want to show details
    }
);
```

After use the `pdfResult` will be formatted as:
```javascript
{
    ok: Boolean,
    // 'ok' -> true if the PDF generation was success, false in any other case
    error: Error,
    // 'error' -> Error information about the case, will be null if 'ok' is true
    documentUrl: string,
    // documentUrl -> URL of the saved PDF document on AWS S3, will be null if 'ok' is false
}
```