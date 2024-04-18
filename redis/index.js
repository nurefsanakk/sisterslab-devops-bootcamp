const express = require('express');
const mysql = require("mysql2");
const redis = require('redis');

const app = express();
const port = 3000;

// MySQL veritabanı bağlantısı
const connection = mysql.createPool({
  host: 'localhost',
  user: "root",
  port: "3306",
  password: "nurcum0",
  database: "blog",
});

// Redis istemcisi
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// MySQL'den belirli bir blog yazısını getirir
function getBlogPostById(id, callback) {
    const sql = 'SELECT * FROM blogs WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('MySQL error:', err);
            callback(err, null);
            return;
        }
        callback(null, results[0]);
    });
}

// Belirli bir blog yazısını Redis'ten getirir
function getBlogPostFromRedis(id, callback) {
    const redisKey = `blog:id:${id}`;
    redisClient.get(redisKey, (err, blogData) => {
        if (err) {
            console.error('Redis error:', err);
            callback(err, null);
            return;
        }
        callback(null, JSON.parse(blogData));
    });
}

// Belirli bir blog yazısını getiren Endpoint
app.get('/blogs/:id', async (req, res) => {
    try {
        const id = req.params.id;

        getBlogPostFromRedis(id, (redisErr, cachedBlog) => {
            if (redisErr || !cachedBlog) {
                getBlogPostById(id, (mysqlErr, blogPost) => {
                    if (mysqlErr || !blogPost) {
                        return res.status(404).json({ message: 'Blog Not Found' });
                    }

                    const redisKey = `blog:id:${id}`;
                    redisClient.set(redisKey, JSON.stringify(blogPost), (err) => {
                        if (err) {
                            console.error('Redis error:', err);
                        } else {
                            console.log('Saved to Redis');
                        }
                    });

                    return res.status(200).json({ message: 'Blog Successfully Found', blog: blogPost });
                });
            } else {
                console.log('Data from Redis');
                return res.status(200).json({ message: 'Blog Successfully Found', blog: cachedBlog });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Server error');
    }
});

// Sunucuyu dinle
app.listen(3000, () =>{
  console.log('listening on port 3000');
});
