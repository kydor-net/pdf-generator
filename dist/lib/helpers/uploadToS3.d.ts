/// <reference types="node" />
import { IAWS } from '../interfaces/IAWS';
export declare function uploadToS3(pdf: Buffer, transactionId: string, documentType: string, awsConfig: IAWS): Promise<string>;
