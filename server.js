const mysql = require('mysql2');
const inquirer = require('inquirer');

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
                    console.log(id.id);
                    responseID = id.id;
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
            },
            {
                name: 'role',
                type: 'list',
                message: 'Select the role:',
                choices: getRoles()
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Select the manager:',
                choices: getEmployees()
            }
        ])
        .then(response => {
            var roleID = 0;
            var managerID = 0;

            connection.query('SELECT id FROM role WHERE title = ?', [response.role], (error, result) => {
                if (error) throw error;

                result.forEach(id => {
                    roleID = id.id;
                })

                var managerFirstName = "";

                for (var i = 0; i < response.manager.length; i++) {
                    if (response.manager.charAt(i) === " ") {
                        break;
                    } else {
                        managerFirstName += response.manager.charAt(i);
                    }
                }

                connection.query('SELECT id FROM employee WHERE first_name = ?', [managerFirstName], (error, nextResult) => {
                    if (error) throw error;

                    nextResult.forEach(id => {
                        managerID = id.id;
                    })

                    connection.query('INSERT INTO employee SET ?', {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: roleID,
                        manager_id: managerID
                    }, (error, result) => {
                        if (error) throw error;
                    })

                    viewEmployees();
                })
            })
        })
}

function updateEmployee() {
    inquirer.prompt([{
            name: 'employee',
            type: 'list',
            message: 'Select the employee:',
            choices: getEmployees()
        }])
        .then(response => {
            connection.query('SELECT * FROM employee', (error, result) => {
                if (error) throw error;
            })
        })
}

function getDepartments() {
    let departments = [];
    connection.query('SELECT name FROM department', (error, response) => {
        if (error) throw error;

        response.forEach(department => {
            departments.push(department.name);
        })
    })

    return departments;
}

function getRoles() {
    let roles = [];
    connection.query('SELECT title FROM role', (error, response) => {
        if (error) throw error;

        response.forEach(role => {
            roles.push(role.title);
        })
    })

    return roles;
}

function getEmployees() {
    let firstNames = [];
    let lastNames = [];
    let employees = [];

    connection.query('SELECT first_name FROM employee', (error, response) => {
        if (error) throw error;

        response.forEach(first_name => {
            firstNames.push(first_name.first_name);
        })

        connection.query('SELECT last_name FROM employee', (error, response) => {
            if (error) throw error;

            response.forEach(last_name => {
                lastNames.push(last_name.last_name);
            })

            for (var i = 0; i < firstNames.length; i++) {
                employees[i] = firstNames[i] + " " + lastNames[i];
            }
        })
    })

    return employees;
}


connection.connect(err => {
    if (err) throw err;

    console.log('connected as id ' + connection.threadId + '\n');
    console.log('WELCOME TO EMPLOYEE TRACKER!' + '\n');

    mainMenu();
})