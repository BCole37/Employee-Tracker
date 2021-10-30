const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '1234',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

// connect to db and open menu
db.connect((err) => {
    if (err) {
     return err;
    } 
    menu();
});

// show the menu then preform the selected action
function menu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Select action',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role(view department first)', 'Add Employee', 'Update Role', 'Quit']       
    }).then(answer => {
        console.log(answer.action)
            if(answer.action === "View All Departments"){
                viewAllDepartments();              
            } else if (answer.action == "View All Roles") {
                viewAllRoles();              
            }  else if (answer.action == "View All Employees") {
                viewAllEmployees();            
            } else if (answer.action == "Add Department") {
                addDepartment();             
            } else if (answer.action == "Add Role(view department first)") {
                addRole();               
            } else if (answer.action == "Add Employee") {
                addEmployee();              
            } else if (answer.action == "Update Role") {
                updateRole();              
            } else if (answer.action == "Quit") {
                db.end();               
            }               
        });
};

// function from miniproject to select the department catagory
function viewAllDepartments() {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, res) => {
        if (err) {
         return err;
        } 
        console.table(res);
        menu();
    });
};

// function from miniproject to select the role catagory and format it
function viewAllRoles() {
    const sql = `SELECT role.title, role.id, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id  ORDER BY role.id;`;
    db.query(sql, function(err, res) {
        if (err) {
         return err;
        } 
        console.table(res);
        menu();
    });
};

// function from miniproject to select the role catagory and format it
function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id ORDER BY employee.id;`;
    db.query(sql, function(err, res) {
        if (err) {
         return err;
        }
        console.table(res);
        menu();
    });
};


// Takes the response for added department then from miniproject adds it into the department section of the database
function addDepartment() {
     inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the department name?'
        }
    ])
    .then (answer => {
    console.log(`Added ${answer.department} to the database`);
    db.query(`INSERT INTO department SET ?`,
        {
            name: `${answer.department}`
        },
        (err, res) => {
            if (err) {
             return err;
            }
            menu();
        });
    })
};

// takes the inputs to the questions then adds a role to a department need to view 
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the role title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the roles salary?'
        }, 
        {
            type: 'input',
            name: 'departmentid',
            message: 'select department ID'        
        }
    ])
    .then(answer => {
    console.log(`Added ${answer.name} to the database`);
    db.query('INSERT INTO role SET ?', 
        {
             title: `${answer.name}`,
             salary: `${answer.salary}`,
             department_id: `${answer.departmentid}`
        },
        (err, res) => {
            if (err) {
            return err;
        }
            menu();
        })
    })  
}

// takes the inputs to the questions then adds an Employee
function addEmployee() {
    inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: 'Input first name of employee: '
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Input last name of employee: '
    },
    {
        type: 'input',
        name: 'roleid',
        message: 'Role id?'
    },
    {
        type: 'input',
        name: 'managerid',
        message: 'Manager id?'
    }
    ])
        .then(answer => {
            console.log(`Added ${answer.firstName} to the database`);
            db.query('INSERT INTO employee SET ?', 
            {
                first_name: `${answer.firstName}`,
                last_name: `${answer.lastName}`,
                role_id: `${answer.roleid}`,
                manager_id: `${answer.managerid}`
            },
                (err, res) => {
                    if (err) {
                        return err;
                    }
                    menu();
                })
        })
    
}

// takes the inputs to the questions then updates a role
function updateRole() {
    inquirer.prompt([
    {
        type: 'input',
        name: 'employee',
        message: 'Enter employee ID'
    },
    {
        type: 'input',
        name: 'role',
        message: 'Enter role ID:'
    }
])
.then(answer => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ? ', [`${answer.role}`, `${answer.employee}`], (error, result) => {
    
        menu();
    })
})
    
}


