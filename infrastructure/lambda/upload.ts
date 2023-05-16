const uuid = require('uuid');
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutCommand } from "@aws-sdk/client-dynamodb";


const s3Client = new S3Client({ region: "eu-est-2" });
const dynamodbClient = new DynamoDBClient({ region: "eu-est-2" });

exports.main = async function (event, _context) {
  const data = JSON.parse(event.body);

  const fileContent = Buffer.from(data.file, 'base64');

  const uniqueId = uuid.v4();

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `factorio_maps_${uniqueId}`,
    Body: fileContent,
  };

  const dynamodbParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      "id": { S: uniqueId },
      "createdAt": { S: new Date().toISOString() },
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(s3Params));
    await dynamodbClient.send(new PutCommand(dynamodbParams));
    return {
      statusCode: 200,
      body: JSON.stringify({ link: uniqueId }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not upload file' }),
    };
  }
};
