import { ITransaction } from './lib/interfaces/ITransaction';
import { IResponse } from './lib/interfaces/IResponse';
import { IAWS } from './lib/interfaces/IAWS';
declare class PDFGenerator {
    aws: IAWS;
    constructor(aws: IAWS);
    generatePDF(documentType: string, transaction: ITransaction): Promise<IResponse>;
}
export default PDFGenerator;
