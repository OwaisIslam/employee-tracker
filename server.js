const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'overlord',
    database: 'tracker'
})

function mainMenu() {
    inquirer.prompt([{
            name: 'mainMenu',
            type: 'list',
            message: "Please select an option: ",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add an employee', 'Update an employee role']
        }])
        .then(response => {
            switch (response.mainMenu) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
            }
        })

}

function viewDepartments() {
    console.log('\nDepartments');

    // connection.promise().query('SELECT * FROM department')
    //     .then((result) => {
    //         console.table(result);
    //     })

    connection.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;
        console.table(result);
    })

    mainMenu();
}

function viewRoles() {
    console.log('\nRoles');

    connection.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;
        console.table(result);
    })

    mainMenu();
}

function viewEmployees() {
    console.log('\nEmployees');

    connection.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;
        console.table(result);
    })

    mainMenu();
}


connection.connect(err => {
    if (err) throw err;

    console.log('connected as id ' + connection.threadId + '\n');
    console.log('Welcome to Employee Tracker!' + '\n');

    mainMenu();
})