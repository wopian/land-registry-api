provider "aws" {
    skip_credentials_validation = true
    skip_metadata_api_check = true
    s3_force_path_style = true
    access_key = "mock_access_key"
    secret_key = "mock_secret_key"
    region = "us-east-1"
    endpoints {
        sns = "http://localhost:4575"
        sqs = "http://localhost:4576"
    }
}

resource "aws_sqs_queue" "local_queue" {
    name = "local-queue"
}

resource "aws_sns_topic" "local_topic" {
    name = "local-topic"
}

resource "aws_sns_topic_subscription" "local_sub" {
    topic_arn = "${aws_sns_topic.local_topic.arn}"
    endpoint = "${aws_sqs_queue.local_queue.arn}"
    protocol = "sqs"
}