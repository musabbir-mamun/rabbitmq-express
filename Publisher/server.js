const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 3000;

app.get('/:id', (req, res) => {
    const portNo = req.params.id;
    publishMessage(portNo, res);
});

function publishMessage(portNo, res){

    amqp.connect(`amqp://localhost`,(err,connection) => {
    if(err){
        throw err;
    }else{

    connection.createChannel((err, channel)=>{
        if(err){
            throw err;
        }
        
        let queueName = "recharge";

        channel.assertQueue(queueName,{
            durable:false
        });

        var data = [{
            portNo: portNo,
            phoneNo: "01726315133",
            amount: 100
         }];
         
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));        // Send JOSN
        // channel.sendToQueue(queueName, Buffer.from("Send a plain message"));   // Send plain message
        console.log(data);

        return res.json({
            result : 'success',
            data : data,
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
