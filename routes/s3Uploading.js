
const fs = require('fs');
const AWS = require('aws-sdk');
const s3CreatingBucket = require('./s3CreatingBucket.js');
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

s3CreatingBucket('arc-testing-bucket-2');

const s3UploadFile = (fileName,bucketName,nameInS3) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: nameInS3, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

s3UploadFile('./../config/aws.txt');