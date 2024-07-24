const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || "845434235447";
const LAMBDA_EXECUTION_ROLE =  `arn:aws:iam::${AWS_ACCOUNT_ID}:role/LabRole`;
const LAMBDA_ZIP_DIR = '../Lambdas/output';
const LAMBDA_CODE_BUCKET = 'csci-5410-s24-sdp-5-lambda-code';
const API_GATEWAY_NAME = 'myApiGateway';
const generated_function_names = [];

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

const generateFunctionYamlCode = (functionName, runtime = 'nodejs20.x', handler = 'index.handler') => {
    const initialCode = `
    ${functionName}:
        Type: AWS::Lambda::Function
        Properties: 
            Handler: ${handler}
            Role: ${LAMBDA_EXECUTION_ROLE} 
            Code: 
                S3Bucket: ${LAMBDA_CODE_BUCKET}
                S3Key: ${functionName}.zip
            Runtime: ${runtime}
            FunctionName: ${functionName}
            Timeout: 60
            Environment: 
                Variables: 
                    AWS_ACCOUNT_ID: ${AWS_ACCOUNT_ID}`
    return initialCode;
}

const generateApiGatewayYamlCode = (apiGatewayName) => {
    return `
    ${apiGatewayName}:
        Type: AWS::ApiGateway::RestApi
        Properties:
            Name: ${apiGatewayName}
            Description: Sample API Gateway
            EndpointConfiguration:
                Types:
                    - "REGIONAL"`
}

const generateApiGatewayResourceYamlCode = (apiGatewayResourceName, parentApiGateway) => {
    return `
    ${apiGatewayResourceName}:
        Type: AWS::ApiGateway::Resource
        Properties:
            ParentId: 
                Fn::GetAtt: 
                    - ${parentApiGateway}
                    - RootResourceId
            PathPart: ${apiGatewayResourceName}
            RestApiId: 
                Ref: ${parentApiGateway}
                
    ${apiGatewayResourceName}OPTIONSMethod:
        Type: AWS::ApiGateway::Method
        Properties:
            RestApiId: !Ref ${parentApiGateway}
            ResourceId: !Ref ${apiGatewayResourceName}
            HttpMethod: OPTIONS
            AuthorizationType: NONE
            Integration:
                Type: MOCK
                RequestTemplates:
                    application/json: |
                        {
                            "statusCode": 200
                        }
                IntegrationResponses:
                    - StatusCode: 200
                      ResponseTemplates:
                        application/json: |
                            {}
                      ResponseParameters:
                        method.response.header.Access-Control-Allow-Methods: "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
                        method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                        method.response.header.Access-Control-Allow-Origin: "'*'"
            MethodResponses:
                - StatusCode: 200
                  ResponseParameters:
                    method.response.header.Access-Control-Allow-Methods: true
                    method.response.header.Access-Control-Allow-Headers: true
                    method.response.header.Access-Control-Allow-Origin: true`
}

const generateApiGatewayMethodYamlCode = (methodName, method, resource, gateway, lambdaFunctionName) => {
    return `
    ${methodName}:
        Type: AWS::ApiGateway::Method
        Properties:
            AuthorizationType: NONE
            HttpMethod: ${method}
            ResourceId: 
                Ref: ${resource}
            RestApiId: 
                Ref: ${gateway}
            Integration:
                IntegrationHttpMethod: POST
                Type: AWS_PROXY
                Uri: !Sub arn:aws:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/\${${lambdaFunctionName}.Arn}/invocations
    ${methodName}LambdaPermissionApiGateway:
        Type: AWS::Lambda::Permission
        Properties:
            Action: "lambda:InvokeFunction"
            FunctionName: !Ref ${lambdaFunctionName}
            Principal: "apigateway.amazonaws.com"
            SourceArn: !Sub "arn:aws:execute-api:\${AWS::Region}:\${AWS::AccountId}:\${${gateway}}/*"`
}

const generateApiGatewayDeploymentYamlCode = (gateway, dependsOn) => {
    const dependsOnString = dependsOn.map((item) => {
        return `
            - ${item}`
    }).join('');
    return `
    ${gateway}Deployment:
        Type: AWS::ApiGateway::Deployment
        Properties:
            RestApiId: 
                Ref: ${gateway}
            StageName: dev
        DependsOn: ${dependsOnString}`
}

const generateInitialCode = () => {
    return `
AWSTemplateFormatVersion: '2010-09-09'
Description: AWS API gateway cicd pipeline.

Resources:`
}

let content = generateInitialCode();


// Function to recursively read directory and generate CloudFormation template
function readDirectoryAndGenerateTemplate(dir, parentPath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      if(item === "GET" || item === "POST" || item === "PUT" || item === "DELETE" || item === "PATCH"){
        const method = item;
        // const lambdaCode = fs.readFileSync(fullPath, 'utf-8');
        const functionName = `${parentPath.replace(/\//g, '')}${method}`;
        console.log(`Generating CloudFormation template for ${functionName}`);
        generated_function_names.push(functionName);
        generated_function_names.push(`${functionName}Method`);
        content += generateFunctionYamlCode(functionName);
        content += generateApiGatewayMethodYamlCode(`${functionName}Method`, method, parentPath, API_GATEWAY_NAME, functionName);
        generated_function_names.push(`${functionName}MethodLambdaPermissionApiGateway`);

        const zipPath = `${LAMBDA_ZIP_DIR}/${functionName}.zip`
        zipDirectory(fullPath, zipPath).then(() => {
            console.log(`Created zip file: ${zipPath}`);
        }).catch(err => {
            console.error(`Error creating zip file for ${functionName}:`, err);
        });
      }
      else if (stats.isDirectory()) {
        const resourcePath = parentPath ? `${parentPath}/${item}` : item;
        console.log(`Generating CloudFormation template for ${resourcePath}`);
        content += generateApiGatewayResourceYamlCode(item, API_GATEWAY_NAME);
        readDirectoryAndGenerateTemplate(fullPath, resourcePath);
      } 
    });
}

const generateExtraFunction = (src, runtime) => {
    const items = fs.readdirSync(src);
    items.forEach(item => {
        const fullPath = path.join(src, item);
        const functionName = item;
        console.log(`Generating CloudFormation template for ${functionName}`);
        //generated_function_names.push(functionName);
        content += generateFunctionYamlCode(functionName, runtime, runtime === 'python3.12' ? `${functionName}.lambda_handler` : undefined);
        const zipPath = `${LAMBDA_ZIP_DIR}/${functionName}.zip`
        zipDirectory(fullPath, zipPath).then(() => {
            console.log(`Created zip file: ${zipPath}`);
        }).catch(err => {
            console.error(`Error creating zip file for ${functionName}:`, err);
        });
    });
}
    
   


const filePath = './output.yaml';
const rootDir = '../Lambdas/src';
const nodeFunctionSrc = '../Lambdas/extra_lambdas/node';
const pythonFunctionSrc = '../Lambdas/extra_lambdas/python';
content += generateApiGatewayYamlCode(API_GATEWAY_NAME);
readDirectoryAndGenerateTemplate(rootDir);
generateExtraFunction(nodeFunctionSrc, 'nodejs20.x');
generateExtraFunction(pythonFunctionSrc, 'python3.12');
content += generateApiGatewayDeploymentYamlCode(API_GATEWAY_NAME, generated_function_names);
fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to the file:', err);
        return;
    }
    console.log(`Content written to ${filePath} successfully!`);
});