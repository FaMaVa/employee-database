const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: '127.0.0.1',

    // Your username
    user: 'root',

    // Your password
    password: 'codeby26',
    database: 'employee_db'
});

inquirer
    .prompt([
        {
            type: 'list',
            name: 'todo',
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
        }
    ])
    .then((task) => {
        switch (task) {
            case "View All Employees":
                viewEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Quit":
                quit();
                break;
        }
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });

const viewEmployees = () => {
    db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });
}
const addEmployee = () => { }
const updateRole = () => { }
const viewRoles = () => {
    db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
  });
}
const addRole = () => { 
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "What is the name of the role?",
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?",
            },
            {
                type: 'list',
                name: 'department',
                message: "Which department does the role belong to?",
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
            }
        ])
        .then((data) => {
            console.log (`Added ${data.name} to the database`);
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}
const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });}
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "What is the name of the department?",
            }
        ])
        .then((data) => {
            console.log (`Added ${data.name} to the database`);
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}
const quit = () => { }
