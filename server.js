const mysql = require('mysql2');
const functions = require('./lib/functions')


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'overlord',
    database: 'tracker'
})

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    functions.mainMenu(connection);
})