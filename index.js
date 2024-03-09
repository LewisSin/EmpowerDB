var inquirer = require('inquirer');
var mysql = require('mysql2/promise');
var express = require('express');
var PORT = process.env.PORT || 3001;
var app = express();

// Used to secure the password
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Creates connection to database using mysql2
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "employee_database"
}).then(connection => {
    console.log("Connected to the employee database");
    return connection;
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

// Prompt questions
var dbNav = [
    {
        name: "prompt",
        type: "list",
        message: "Hello, what would you like to look at today?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update employee role", "end"]
    }
];

// Function to prompt the initial set of questions then uses a switch case to execute their related functions
async function promptQuestions() {
    const data = await inquirer.prompt(dbNav);
    switch (data.prompt) {
        case "view all departments":
            await viewDepartments();
            break;
        case "view all roles":
            await viewRoles();
            break;
        case "view all employees":
            await viewEmployees();
            break;
        case "add a department":
            await newDepartment();
            break;
        case "add a role":
            await newRole();
            break;
        case "add an employee":
            await newEmployee();
            break;
        case "update employee role":
            await updateRole();
            break;
        case "end":
            await end();
            break;
    }
}

async function viewDepartments() {
    console.log("Viewing all departments...");
    const [rows] = await (await db).query("SELECT * FROM department");
    console.table(rows);
    await promptQuestions();
}

async function viewRoles() {
    console.log("Viewing all roles...");
    const [rows] = await (await db).query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id;");
    console.table(rows);
    await promptQuestions();
}

async function viewEmployees() {
    console.log("Viewing all employees...");
    const [rows] = await (await db).query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, role.salary AS salary, department.name AS department, manager.first_name AS manager_firstName, manager.last_name AS manager_lastName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;");
    console.table(rows);
    await promptQuestions();
}

async function newDepartment() {
    const answers = await inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "Type the name of the department"
        }
    ]);
    await (await db).query("INSERT INTO department (name) VALUES (?)", [answers.newDepartment]);
    console.log("Department added successfully");
    await viewDepartments();
}

async function newRole() {
    const [departments] = await (await db).query("SELECT * FROM department");
    const departmentChoices = departments.map(({ id, name }) => ({ name, value: id }));

    const answers = await inquirer.prompt([
        {
            name: "newRole",
            type: "input",
            message: "Type the name of the role"
        },
        {
            name: "roleSalary",
            type: "input",
            message: "What is the salary of the role"
        },
        {
            name: "departmentId",
            type: "list",
            message: "Which department does this role belong to?",
            choices: departmentChoices
        }
    ]);

    await (await db).query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.newRole, answers.roleSalary, answers.departmentId]);
    console.log("Role added successfully");
    await viewRoles();
}

// Function to add new employee (for example purposes, similar adjustments should be made)
async function newEmployee() {
    try {
        const [roles] = await (await db).query("SELECT id, title FROM role");
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const [managers] = await (await db).query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NULL OR manager_id != ''");
        const managerChoices = managers.map(manager => ({ name: manager.name, value: manager.id }));
        managerChoices.unshift({ name: 'None', value: null });

        const answers = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name of the employee?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name of the employee?',
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'What is the role of the employee?',
                choices: roleChoices,
            },
            {
                name: 'managerId',
                type: 'list',
                message: 'Who is the manager of the employee?',
                choices: managerChoices,
            },
        ]);

        await (await db).query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answers.firstName, answers.lastName, answers.roleId, answers.managerId || null]);
        console.log("Employee added successfully.");
        await viewEmployees();
    } catch (err) {
        console.error("Failed to add new employee:", err);
        await promptQuestions();
    }
}

// Placeholder for updateRole function
async function updateRole() {
    try {
        // Fetch the list of employees
        const [employees] = await (await db).query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee");
        const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));

        // Prompt the user to select an employee
        const { employeeId } = await inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
            }
        ]);

        // Fetch the list of roles
        const [roles] = await (await db).query("SELECT id, title FROM role");
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        // Prompt the user to select a new role for the employee
        const { roleId } = await inquirer.prompt([
            {
                name: 'roleId',
                type: 'list',
                message: 'What is the new role of the employee?',
                choices: roleChoices
            }
        ]);

        // Update the employee's role in the database
        await (await db).query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
        console.log("Employee's role updated successfully.");
        await viewEmployees();
    } catch (err) {
        console.error("Failed to update employee's role:", err);
        await promptQuestions();
    }
}


// Shuts down the server and database connection when done
async function end() {
    console.log("Exiting application...");
    await (await db).end();
    process.exit();
}

// Starts the application by calling initial prompt questions
promptQuestions();

// Express server status, not necessary for a CLI application but included for completeness
app.use(function (req, res) {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
