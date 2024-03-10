const { Pool } = require('pg');

const pool = new Pool({
    user: 'user-name',
    host: 'localhost',
    database: 'postgres',
    password: 'nurefsan1',
    port: 5432,
});

module.exports = pool;