const AWS = require('aws-sdk')
const { promisify, inspect } = require('util')

// https://github.com/localstack/localstack/issues/801
// https://medium.com/@FloSloot/your-own-local-copy-of-aws-w-node-js-6d98a10533a8
// SubscriptionArn": "arn:aws:sns:us-east-1:000000000000:local-topic:fd5be94c-3384-4bc2-8ed6-0b8a66380e7b"

AWS.config.update({ region: 'us-east-1' })

const sqs = new AWS.SQS({ endpoint: 'http://localhost:4576' })

sqs.receiveMessage = promisify(sqs.receiveMessage)

const QueueUrl = 'http://localhost:4576/queue/local-queue'
const receiveParams = {
    QueueUrl,
    MaxNumberOfMessages: 1
}

async function receive() {
    try {
        const queueData = await sqs.receiveMessage(receiveParams)
    
        if (
            queueData &&
            queueData.Messages &&
            queueData.Messages.length > 0
        ) {
            const [ firstMessage ] = queueData.Messages

            console.log(`RECEIVED: ${inspect(firstMessage)}`)

            const deleteParams = {
                QueueUrl,
                ReceiptHandle: firstMessage.ReceiptHandle
            }

            sqs.deleteMessage(deleteParams)
        } else {
            console.log('waiting...')
        }
    } catch (e) {
        console.log(`ERROR: ${e}`)
    }
}

setInterval(receive, 500)