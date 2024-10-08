const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 3001;

receiveMessage();

function receiveMessage() {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err) {
            throw err;
        }
        connection.createChannel((err, channel) => {
            if (err) {
                throw err;
            }

            let queueName = "recharge";

            channel.assertQueue(queueName, {
                durable: false
            });

            channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    console.log('Received');
                    console.log(JSON.parse(msg.content));  // Receive JSON
                    //console.log(`Received: ${msg.content.toString()}`);  // Receive plain message
                    // Acknowledge the message
                    channel.ack(msg);
                }
            }, {
                noAck: false  // Ensure acknowledgments are enabled
            });
        });
    });
}


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
