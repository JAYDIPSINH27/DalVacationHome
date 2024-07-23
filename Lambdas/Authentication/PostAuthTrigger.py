import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    dynamodb = boto3.resource('dynamodb')
    table_name = 'login_data'
    table = dynamodb.Table(table_name)
    
    # Extract the user's email and SNS topic ARN from the event
    user_email = event['request']['userAttributes']['email']
    sns_topic_arn = event['request']['userAttributes']['custom:sns_topic_arn']
    username = event['userName']
    
    # Message content
    subject = 'Login Notification'
    message = f"Hello,\n\nYou have successfully logged in with the email: {user_email}."
    
    # Publish the message to the SNS topic
    sns_client.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject=subject
    )
    
    timestamp = datetime.utcnow().isoformat()
    table.update_item(
        Key={'username': username},
        UpdateExpression='SET last_login = :val',
        ExpressionAttributeValues={':val': timestamp}
    )
    
    # Return the event object to match the expected response format
    return event
