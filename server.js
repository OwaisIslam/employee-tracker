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
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add an employee', 'Update an employee role', 'Exit']
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
                case 'Exit':
                    connection.end();
                    break;
            }
        })

}

function viewDepartments() {
    connection.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;

        console.log('\nDepartments');
        console.table(result);

        mainMenu();
    })
}

function viewRoles() {
    connection.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;

        console.log('\nRoles');
        console.table(result);

        mainMenu();
    })
}

function viewEmployees() {
    connection.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;

        console.log('\nEmployees');
        console.table(result);

        mainMenu();
    })
}

function addDepartment() {
    inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter the department name: '
        }])
        .then(response => {
            connection.query("INSERT INTO department(id, name) VALUES (?,?)", [10, response.name], (error, result) => {
                if (error) throw error;
            })

            viewDepartments();
        })
}

function addEmployee() {

}

function updateEmployee() {

}


connection.connect(err => {
    if (err) throw err;

    console.log('connected as id ' + connection.threadId + '\n');
    console.log('WELCOME TO EMPLOYEE TRACKER!' + '\n');

    mainMenu();
})