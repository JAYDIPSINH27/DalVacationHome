#!/bin/bash

# Variables
BUCKET_NAME="csci-5410-s24-sdp-5-lambda-code-shubhampawar"  # Replace with your actual bucket name
STAGE_NAME="dev"    # Replace with your actual stage name
REGION="us-east-1"            # Replace with your AWS region

# List all zip files in the S3 bucket
FILES=$(aws s3 ls s3://$BUCKET_NAME/ --recursive | awk '{print $4}')

# Loop through each file and update the corresponding Lambda function
for FILE in $FILES; do
    if echo $FILE | grep -q ".zip$"; then
        FUNCTION_NAME=$(basename $FILE .zip)
        echo "Updating Lambda function: $FUNCTION_NAME with file: $FILE"
        
        # Update Lambda function code
        aws lambda update-function-code --function-name $FUNCTION_NAME --s3-bucket $BUCKET_NAME --s3-key $FILE --region $REGION
    fi
done
 # Deploy the changes to the specified stage (assuming API Gateway deployment)
aws apigateway create-deployment --rest-api-id hmemmeyh1b --stage-name $STAGE_NAME --region $REGION
echo "All Lambda functions updated and deployed."