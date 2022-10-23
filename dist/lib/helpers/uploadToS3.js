"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const AWS = require("aws-sdk");
async function uploadToS3(pdf, transactionId, documentType, awsConfig) {
    try {
        const region = awsConfig.region;
        const accessKeyId = awsConfig.accessKeyId;
        const secretAccessKey = awsConfig.secretAccessKey;
        const bucketName = awsConfig.bucket;
        const s3 = new AWS.S3({
            region,
            accessKeyId,
            secretAccessKey,
        });
        const params = {
            Body: pdf,
            Bucket: `${bucketName}/${documentType}s`,
            Key: `${transactionId}.pdf`,
        };
        await s3.putObject(params).promise();
        const fileName = `${transactionId}.pdf`;
        return fileName;
    }
    catch (error) {
        console.log('Error uploading file', error);
        const fileName = `${transactionId}.pdf`;
        return fileName.split('.').pop()
            ? `error.${fileName.split('.').pop()}`
            : `error.png`;
    }
}
exports.uploadToS3 = uploadToS3;
