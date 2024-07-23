import json
import boto3
import urllib.parse


def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    sqs_client = boto3.client('sqs')
    cognito_client = boto3.client('cognito-idp')
    user_email = event['request']['userAttributes']['email']
    
    user_pool_id = event['userPoolId']
    user_email = event['request']['userAttributes']['email']
    username = event['userName']
    print(event)
    
    # Create a unique SNS topic for the user
    topic_name = f"AuthTopic-{event['request']['userAttributes']['sub']}"
    create_topic_response = sns_client.create_topic(Name=topic_name)
    topic_arn = create_topic_response['TopicArn']
    
    # Subscribe the user's email to the SNS topic
    subscription_response = sns_client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=user_email
    )
    subscription_arn = subscription_response['SubscriptionArn']
    
    # Generate the SNS subscription confirmation URL
    subscribe_url = f"https://email-sns.amazonaws.com/?Action=ConfirmSubscription&TopicArn={urllib.parse.quote_plus(topic_arn)}&Token={subscription_response['ResponseMetadata']['RequestId']}"
    
    
    print("usernameeeee", username)
    
    # Update the user's attributes to include the SNS topic ARN
    cognito_client.admin_update_user_attributes(
        UserPoolId=user_pool_id,
        Username=username,
        UserAttributes=[
            {
                'Name': 'custom:sns_topic_arn',
                'Value': topic_arn
            }
        ]
    )
    
    
    # Send a message to the SQS queue to delay the "registration successful" notification
    sqs_client.send_message(
        QueueUrl='https://sqs.us-ea.amazonaws.com/845434235447/RegistrationQueue',
        MessageBody=json.dumps({
            'topic_arn': topic_arn,
            'user_email': user_email
        }),
        DelaySeconds=60  # Delay for 1 minute
    )

    return event
