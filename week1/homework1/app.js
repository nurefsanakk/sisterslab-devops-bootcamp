"use strict";
const express = require("express");
const dbConnection = require("./helper/mysql");
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

//check db connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection error: ", err);
  } else {
    console.log("Database connected");
  }
});

// Processing POST data using middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Student Listing
app.get('/students', (req, res) => {
  dbConnection.query("select * from students", (err, results, fields) => {
    if(err){
      console.log("Database query error: ", err);
    }
    else{
      res.status(200).json({
        sttatus: "success",
        data: results,
      });
    }
  });
});


// Student adding with post data 
app.post('/students/add', (req, res) => {
  const { name, age, midterm_grade, final_grade } = req.body;
  
  if (!name || !age || !midterm_grade || !final_grade) {
    return res.status(400).send('Eksik bilgi girdiniz.');
  }

  const student = { name, age, midterm_grade, final_grade};
  const sql = 'INSERT INTO students SET ?';
  
  dbConnection.query(sql, student, (err, result, fields) => {
    if (err) {
      console.error('Öğrenci ekleme hatası:', err);
      return res.status(500).send('Öğrenci eklenirken bir hata oluştu.');
    }
    console.log('Yeni öğrenci eklendi:', student);
    res.status(201).json({
      status: "success",
      data: student,
      message: 'Yeni öğrenci eklendi'
    });
  });
});


// Fetching student information by ID
app.get('/students/:id', (req, res) => {
  let sql = 'SELECT * FROM students WHERE id = ?';
  dbConnection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const students = result[0];
      const average = (parseInt(students.midterm_grade) + parseInt(students.final_grade)) / 2;
      students.average = average;
      res.json(students);
    } else {
      res.status(404).send('Öğrenci bulunamadı');
    }
  });
});

// Starting server
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});




