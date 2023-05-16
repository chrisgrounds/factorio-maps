const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: "eu-est-2" });

exports.main = async function (event, context) {
  const id = event.pathParameters.id;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `factorio_maps_${id}`,
  };


  await s3Client.send(new GetObjectCommand(s3Params));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: file.Body.toString(),
    isBase64Encoded: false,
  };
};
