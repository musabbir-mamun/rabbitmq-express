const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 3000;

app.get('/:id', (req, res) => {
    const userId = req.params.id;
    publishMessage(userId, res);
});

function publishMessage(data, res){

    amqp.connect(`amqp://localhost`,(err,connection) => {
    if(err){
        throw err;
    }else{

    connection.createChannel((err, channel)=>{
        if(err){
            throw err;
        }
        
        let queueName = "attendance";
        let message = "Insert attendance "+data;

        channel.assertQueue(queueName,{
            durable:false
        });

        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message : ${message}`);

        return res.json({
            result : 'success',
            data : message,
            message : 'Data sent to subscriber',
        });

        // setTimeout(()=>{
        //     connection.close();
        // }, 5000)
    })
}

})

}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
