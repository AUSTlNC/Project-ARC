var AWS = require('aws-sdk');

var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling createBucket
var bucketParams = {
  Bucket : process.argv[2]
};

// call S3 to create the bucket
s3.createBucket(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Location);
  }
});

// // call S3 to retrieve upload file to specified bucket
// var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
// var file = process.argv[3];
//
// Configure the file stream and obtain the upload parameters
// var fs = require('fs');
// var fileStream = fs.createReadStream(file);
// fileStream.on('error', function(err) {
//   console.log('File Error', err);
// });
// uploadParams.Body = fileStream;
// var path = require('path');
// uploadParams.Key = path.basename(file);
//

//aws configure list
//Access ID: AKIA3CMUAG6KJRO2WTY2
//Secret Access Key: 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

// var connect = new AWS.Connect();
// connect.associateApprovedOrigin(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
//
// var connect = new AWS.Connect({apiVersion: '2017-08-08'});
//
// AWS.config.apiVersions = {
//   connect: '2017-08-08',
//   // other service API versions
// };
//
// var connect = new AWS.Connect();