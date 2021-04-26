const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: '2893445Ya',
    database: 'employee_trackerDB',
});
connection.connect((err) => {
    if (err) throw err;
    menu();
});
connection.query = util.promisify(connection.query);

const menu = () => {
    inquirer
        .prompt([
            {
                name: 'options',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View Employees', 'Add Employee', 'View Roles', 'Add Department', 'Add Role', 'View Departments', 'Update Employee Roles', 'Delete Department', 'Delete Roles', 'Delete Employees', 'Exit']
            },
        ])
        .then((answer) => {
            console.log(answer.options);
            switch (answer.options) {
                case 'View Employees':
                    viewEmployees();
                    break;

                case 'View Departments':
                    viewDepartment();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Employees':
                    addEmployees();
                    break;

                case 'View Roles':
                    deleteRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Update Employee Roles':
                    updateRole();
                    break;

                case 'Delete Department':
                    deleteDepartment();
                    break;

                case 'Delete Roles':
                    deleteRoles();
                    break;

                case 'Delete Employees':
                    deleteEmployees();
                    break;

                case 'Exit':
                    console.log('Goodbye');
                    connection.end();
            }
        });
};

const viewEmployees = () => {
    console.log('Retrieving all Employees...');
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();

    });
};

const viewDepartment = () => {
    console.log('Retrieving all departments...');
    connection.query('SELECT name FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();

    });
};


const viewRoles = () => {
    console.log('Retrieving all roles...');
    connection.query('SELECT title, salary FROM role', (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();

    });
};

let departmentArr = [];

const getDepartment = () => {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw (err)
        for (let i = 0; i < res.length; i++) {
            departmentArr.push(res[i].name);
        }
    })
    return departmentArr;
}



//--Empty array holding all title of roles
let rolesArray = [];
// function to view all roles
function pickRole() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw (err)
        for (let i = 0; i < res.length; i++) {
            rolesArray.push(res[i].title);

        }
    })
    return rolesArray;
}


let updatedRole = [];
const getRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        res.forEach(({ title, id }) => {
            updatedRole.push({ name: title, value: id });
        });

    });
    return updatedRole;
};


//-Empty array that holds the first name of managers
let managersArray = [];
// function to view the names of all the managers
function pickManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managersArray.push(res[i].first_name + " " + res[i].last_name);

        }
    })
    return managersArray;
}



const addRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the title of your role?',
                    validate: data => {
                        if (data !== "") {
                            return true
                        }
                        return "Please enter a title."
                    }
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of your new role?',
                    validate: data => {
                        if (data !== "") {
                            return true
                        }
                        return "Please enter a title."
                    }
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'What is the department of your new role?',
                    choices: getDepartment()

                },
            ])
            .then((answer) => {
                console.log("Adding new role....");
                let departmentId = getDepartment().indexOf(answer.department) + 1
                let newRole = { title: answer.title, salary: answer.salary, department_id: departmentId }
                connection.query('INSERT INTO role SET ?', newRole, function (err, data) {
                    if (err) throw err;
                    viewRoles();

                });
            });
    });
}


const addDepartment = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the title of your department?',
                    validate: data => {
                        if (data !== "") {
                            return true
                        }
                        return "Please enter a title."
                    }
                },

            ])
            .then((answer) => {
                console.log("Adding new department....");
                let newDepartment = { name: answer.title, }
                connection.query('INSERT INTO department SET ?', newDepartment, function (err, data) {
                    if (err) throw err;
                    viewDepartment();


                });
            });
    });
}





const addEmployees = () => {
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is your new employees first name?',
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is your new employees last name?'
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is your new employees role ?',
                choices: pickRole()
            },
            {
                name: 'manager',
                type: 'rawlist',
                message: 'Who is your new employees manager?',
                choices: pickManager()
            },
        ])
        .then((answer) => {
            console.log('Adding Employee...');
            let roleId = pickRole().indexOf(answer.role) + 1
            let managerId = pickManager().indexOf(answer.manager) + 1
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: roleId,
                    manager_id: managerId,

                },
                (err) => {
                    if (err) throw err;
                    console.table(answer);
                    menu();

                });
        })
};

const updateRole = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeUpdate',
                    message: "Which employee's role would you like to update?",
                    choices() {
                        const ChoiceArr = [];
                        res.forEach(({ first_name, last_name, id }) => {
                            ChoiceArr.push({ name: first_name + " " + last_name, value: id });
                        });
                        return ChoiceArr;
                    },
                },
                {
                    type: 'list',
                    name: "newRole",
                    message: 'Which role would you like to assign to this employee?',
                    choices: getRoles()
                },
            ]).then((answer) => {
                console.log(answer.newRole);
                console.log(answer.employeeUpdate);
                connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.newRole, answer.employeeUpdate], function (err, data) {
                    if (err) throw err;
                    viewEmployees();
                })
            })
    })
}


const deleteDepo = async () => {
    let res = await connection.query('SELECT * FROM department')
    return res.map(departments => {
        return {
            name: departments.name,
            value: departments.id
        }
    }); 
};

const deleteDepartment = () => {
        inquirer
            .prompt([
               {
                type: 'list',
                name: 'deleteDep',
                message: 'What Departmment would you like to delete?',
                choices: () => deleteDepo()
               },
            ]).then((answer) => {
                
                connection.query('DELETE FROM department WHERE id = ?', answer.deleteDep, (err, data) => {
                    if (err) throw err;
                    viewDepartment();
                
                })
            })
}  

const deleteEmpo = async () => {
    let res = await connection.query('SELECT * FROM employee');
    let employeeArray = res.map((employees) => {
        return {
            name: `${employees.first_name} ${employees.last_name}`,
            value: employees.id
        };
    }); 
    console.log(employeeArray);
    return employeeArray;
}

const deleteEmployees = () => {
        inquirer
            .prompt([
               {
                type: 'list',
                name: 'deleteEmp',
                message: 'What Employees would you like to delete?',
                choices: () => deleteEmpo()
               },
            ]).then((answer) => {
                
                connection.query('DELETE FROM employee WHERE id = ?', answer.deleteEmp, (err, data) => {
                    if (err) throw err;
                    viewEmployees();
                
                })
            })
}  

const deleteRole = async () => {
    let res = await connection.query('SELECT * FROM role');
    let roleArray = res.map((roles) => {
        return {
            name: roles.title,
            value: roles.id
        };
    }); 
    console.log(roleArray);
    return roleArray;
}

const deleteRoles = () => {
    inquirer
        .prompt([
           {
            type: 'list',
            name: 'deleteRole',
            message: 'What Roles would you like to delete?',
            choices: () => deleteRole()
           },
        ]).then((answer) => {
            
            connection.query('DELETE FROM role WHERE id = ?', answer.deleteRole, (err, data) => {
                if (err) throw err;
                viewRoles();
            
            })
        })
}  