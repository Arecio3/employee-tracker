const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');

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

const menu = () => {
    inquirer
        .prompt([
            {
                name:'options',
                type:'list',
                message:'What would you like to do?',
                choices: ['View Employees','Add Employee', 'View Roles', 'Add Department', 'Add role', 'View Departments']
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

                case 'Add Employee':
                    addEmployees();
                    break;

                case 'View Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;
            }
        });
};

const viewEmployees = () => {
    console.log('Retrieving all Employees...');
    connection.query('SELECT * FROM employee', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();
       
    });
};

const viewDepartment = () => {
    console.log('Retrieving all departments...');
    connection.query('SELECT name FROM department', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();
       
    });
};


const viewRoles = () => {
    console.log('Retrieving all roles...');
    connection.query('SELECT title, salary FROM role', (err, data) => {
        if(err) throw err;
        console.table(data);
        menu();
        
    });
};
//--Empty array holding all title of roles
let rolesArray = [];
// function to view all roles
function pickRole() {
    connection.query('SELECT * FROM role', function(err, res) {
        if(err) throw (err)
        for (let i = 0; i < res.length; i++) {
            rolesArray.push(res[i].title);
            
        }
    })
    return rolesArray;
}

//-Empty array that holds the first name of managers
var managersArray = [];
// function to view the names of all the managers
function pickManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    }

  })
  return managersArray;
}


const addEmployees = () => {
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is your new employees first name?'
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
                if(err) throw err;
                console.table(answer);
                menu();
               
            });
        })
};
