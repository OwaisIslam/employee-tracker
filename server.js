const mysql = require('mysql2');
const inquirer = require('inquirer');
const {
    throwError
} = require('rxjs');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'overlord',
    database: 'employee-tracker'
})

function mainMenu() {
    inquirer.prompt([{
            name: 'mainMenu',
            type: 'list',
            message: "Please select an option: ",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
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
                case 'Add a role':
                    addRole();
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
            connection.query('INSERT INTO department(name) VALUES (?)', [response.name], (error, result) => {
                if (error) throw error;
            })

            viewDepartments();
        })
}

function addRole() {
    inquirer.prompt([{
                name: 'name',
                type: 'input',
                message: 'Enter the role name: '
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Enter the salary: '
            },
            {
                name: 'department',
                type: 'list',
                message: 'Select the department:',
                choices: getDepartments()
            }
        ])
        .then(response => {

            var responseID = 0;

            connection.query('SELECT id FROM department WHERE name = ?', [response.department], (error, result) => {
                if (error) throw error;
                result.forEach(id => {
                    responseID = id.id;
                })
            })


            connection.query('INSERT INTO role SET ?', {
                title: response.name,
                salary: response.salary,
                department_id: responseID
            }, (error, result) => {
                if (error) throw error;
            })

            viewRoles();
        })
}

function addEmployee() {
    inquirer.prompt([{
                name: 'firstName',
                type: 'input',
                message: 'Enter the employee first name: '
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter the employee last name: '
            }
        ])
        .then(response => {
            connection.query('INSERT INTO employee(first_name, last_name) VALUES (?,?)', [response.firstName, response.lastName], (error, result) => {
                if (error) throw error;
            })

            viewDepartments();
        })
}

function updateEmployee() {

}

function getDepartments() {
    let departments = [];
    connection.query('SELECT name FROM department', (error, response) => {
        if (error) throw error;

        response.forEach(department => {
            departments.push(department.name);
            // console.log(departments);
        })
        // console.log(departments);
    })

    // console.log(departments);

    return departments;
}

function getRoles() {
    let roles = [];
    connection.query('SELECT title FROM role', (error, response) => {
        if (error) throw error;

        response.forEach(role => {
            roless.push(role.name);
        })
    })

    return roles;
}


connection.connect(err => {
    if (err) throw err;

    console.log('connected as id ' + connection.threadId + '\n');
    console.log('WELCOME TO EMPLOYEE TRACKER!' + '\n');

    mainMenu();
})