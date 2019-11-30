const AWS = require('aws-sdk')
const { promisify, inspect } = require('util')

// LocalStack uses 'us-east-1' by default
AWS.config.update({ region: 'us-east-1' })

const sns = new AWS.SNS({ endpoint: 'http://localhost:4575' })

sns.publish = promisify(sns.publish)

const TopicArn = 'arn:aws:sns:us-east-1:000000000000:local-topic'

async function publish(msg) {
    const publishParams = {
        TopicArn,
        Message: msg
    }

    let topicRes

    try {
        topicRes = await sns.publish(publishParams)
    } catch (e) {
        topicRes = e
    }

    console.log(`Topic Response: ${inspect(topicRes)}`)
}

for (let i = 0; i < 5; i++) {
    publish(`Message #${i}`)
}

/*
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)")

    const statement = db.prepare("INSERT INTO lorem VALUES (?)")
    for (let i = 0; i < 10; i++) {
        statement.run(`Ipsum ${i}`)
    }
    statement.finalize()

    db.each("SELECT rowid as id, info FROM lorem", (err, row) => {
        console.log(`${row.id}: ${row.info}`)
    })
})

db.close()
*/