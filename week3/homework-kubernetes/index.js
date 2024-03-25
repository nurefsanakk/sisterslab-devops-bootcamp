const express = require("express");
const mysql = require("mysql2");
const app = express();

const connection = mysql.createPool({
    connectionLimit: 10,
    host: "mysql-service",     
    user: "root",
    password: "password",
    database: "devopsakademi"
});

connection.getConnection((err,connection) =>{
    if(err){
        console.log("Error connecting to database");
    }
    else{
        console.log("Connected to database");
    }
});

async function receiveMessage() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq-service:5672');
        const channel = await connection.createChannel();
        const queue = 'message-queue';
        
        await channel.assertQueue(queue);
        console.log("Waiting for messages...");
    
        channel.consume(queue, async (message) => {
            const content = message.content.toString();
            console.log("Message received:", content);
            
            // Mesaj içeriğini işleme
            const sqlQuery = content;

            // Mesajı veritabanına kaydetme işlemi
            connection.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    console.error("Error executing SQL query:", error);
                } else {
                    console.log("SQL query executed:", sqlQuery);
                }
            });
        }, { noAck: true });
    } catch (error) {
        console.error("Error:", error);
    }
}

// sendMessage fonksiyonunu çağırarak RabbitMQ'ya SQL sorgusu gönder
sendMessage();

app.get("/", (req ,res)=>{
    res.send("Hello World");
});

app.listen(2000, ()=> {
    console.log("Server is starting on port 2000")
});