import { Stack, StackProps, RemovalPolicy, CfnOutput, Duration } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ZoomableMapServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MapBucket', {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const table = new dynamodb.Table(this, 'MapLinksTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const mapLinkLambda = new nodejs.NodejsFunction(this, 'MapLinkHandler', {
      entry: 'lambda/upload.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        target: 'es2018',
      },
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
    });

    bucket.grantReadWrite(mapLinkLambda);
    table.grantReadWriteData(mapLinkLambda);

    const mapUploadAPI = new apigateway.RestApi(this, 'MapUploadApi', {
      restApiName: 'Map Upload Service',
    });

    const maps = mapUploadAPI.root.addResource('maps');
    const uploadIntegration = new apigateway.LambdaIntegration(mapLinkLambda);

    maps.addMethod('POST', uploadIntegration);

    const fetchLambda = new nodejs.NodejsFunction(this, 'MapLinkHandler', {
      entry: 'lambda/fetch.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        target: 'es2018',
      },
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
    });

    bucket.grantRead(fetchLambda);

    const singleMap = maps.addResource('{id}');
    const fetchIntegration = new apigateway.LambdaIntegration(fetchLambda);
    singleMap.addMethod('GET', fetchIntegration);

    new CfnOutput(this, 'MapUploadAPIURL', {
      value: mapUploadAPI.url,
    });
  }
}
