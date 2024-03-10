const express = require('express');
const pool = require('./helper/postgre.js');

const app = express();
const port = 3001;

app.use(express.json());

// Öğrenci ekleme
app.post("/student/add", (req, res) => {
    const { name, surname } = req.body;
    const queryString = "INSERT INTO students_table (name, surname) VALUES ($1, $2)";
    pool.query(queryString, [name, surname], (err, results, fields) => {
        if (err) {
            console.log("Veritabanı sorgu hatası: ", err);
            res.status(500).json({ status: "error", message: "Veritabanına öğrenci eklenirken bir hata oluştu" });
        } else {
            console.log("Veri başarıyla eklendi");
            res.status(200).json({ status: "success", message: "Öğrenci başarıyla eklendi" });
        }
    });
});



// Veri listeleme endpoint'i
app.get('/getStudent', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students_table');
        res.json(result.rows);
    } catch (err) {
        console.error('Error getting data', err);
        res.status(500).json({ error: 'Error getting data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

