import boto3
import base64

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = "your-s3-bucket-name"
    file_name = event.get('file_name', 'uploaded_file.pdf')
    file_content = base64.b64decode(event['file_content'])

    s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_content)
    return {"status": "File uploaded successfully"}
