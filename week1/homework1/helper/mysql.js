const mysql = require("mysql2");

const connection = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "nurefsan.",
  database: "week1-homework",
});

module.exports = connection;
