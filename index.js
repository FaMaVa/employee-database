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

const options = () => {
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
            console.log(task);
            switch (task.todo) {
                case "View All Employees": //
                    viewEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "View All Roles": //
                    viewRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments": //
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
};

const viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        options();
    });
}
const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?",
            }
        ])
        .then((data) => {
            db.query('SELECT * FROM role', function (err, results) {
                if (err) throw err;
                const roles = results.map(({ title, id }) => ({ name: title, value: id }));
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's role?",
                            choices: roles,
                        }
                    ])
                    .then((data2) => {
                        db.query('SELECT * FROM employee', function (err, results) {
                            if (err) throw err;
                            const managers = results.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));
                            managers.push("None");
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: "Who is the employee's manager?",
                                        choices: managers
                                    }
                                ])
                                .then((data3) => {
                                    if (data3.manager === "None") {
                                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES ("${data.first_name}", "${data.last_name}", ${data2.role}, NULL)`, function (err, results) {
                                            if (err) throw err;
                                            console.log(`Added ${data.first_name} ${data.last_name} to the database`);
                                            options();
                                        });
                                    } else {
                                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES ("${data.first_name}", "${data.last_name}", ${data2.role}, ${data3.manager})`, function (err, results) {
                                            if (err) throw err;
                                            console.log(`Added ${data.first_name} ${data.last_name} to the database`);
                                            options();
                                        });
                                    };
                                })
                        });
                    })
            });
        });
}

const updateRole = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        const employees = results.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: employees,
                }
            ])
            .then((data) => {
                db.query('SELECT * FROM role', function (err, results) {
                    if (err) throw err;
                    const roles = results.map(({ title, id }) => ({ name: title, value: id }));
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message: "Which role do you want to assign the selected employee?",
                                choices: roles,
                            }
                        ])
                        .then((data2) => {
                            db.query(`UPDATE employee SET role_id = ${data2.role} WHERE id = ${data.employee}`), function (err, results) {
                                if (err) throw err;
                            };
                            console.log("Updated role");
                            options();  
                        });
                })
            });
    })
};
const viewRoles = () => {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        options();
    });
}
const addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the name of the role?",
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?",
            }
        ])
        .then((data) => {
            db.query('SELECT * FROM department', function (err, results) {
                if (err) throw err;
                const departments = results.map(({ name, id }) => ({ name: name, value: id }));
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: "Which department does the role belong to?",
                            choices: departments,
                        }
                    ])
                    .then((data2) => {
                        db.query(`INSERT INTO role (title, salary, department_id)
                        VALUES ("${data.title}", ${data.salary}, ${data2.department})`, function (err, results) {
                            if (err) throw err;
                            console.log(`Added ${data.title} to the database`);
                            options();
                        });
                    })
            });
        });
}

const viewDepartments = () => {
    db.query(`SELECT department.id AS id, department.name FROM department`, function (err, results) {
        if (err) throw err;
        console.table(results);
        options();
    });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: "What is the name of the department?",
                validate: department => {
                    if (department) {
                        return true;
                    } else {
                        console.log("Please enter a valid department to add.")
                        return false;
                    }
                }
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO department (name)
            VALUES ("${data.department}")`, function (err, results) {
                if (err) throw err;
                console.log(`Added ${data.department} to the database`);
            });
            options();
        });
}

const quit = () => {
    db.end()
}

options();