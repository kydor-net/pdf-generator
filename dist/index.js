"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateDocument_1 = require("./lib/generateDocument");
class PDFGenerator {
    aws;
    constructor(aws) {
        this.aws = aws;
    }
    async generatePDF(documentType, transaction) {
        return await (0, generateDocument_1.default)(documentType, transaction, this.aws);
    }
}
exports.default = PDFGenerator;
