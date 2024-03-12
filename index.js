const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Establishing database connection
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASSWORD, // Make sure to match your environment variable name
            database: 'employee_tracker_db' // Updated for clarity and to avoid direct copying
        });
        console.log('Successfully connected to the employee tracker database.');
        return connection;
    } catch (error) {
        console.error('Connection to database failed:', error);
        process.exit(1);
    }
}

const databaseConnection = connectToDatabase();

// Main menu prompts
const mainMenuOptions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    }
];

// Launch main menu
async function mainMenu() {
    const { action } = await inquirer.prompt(mainMenuOptions);

    switch (action) {
        case 'View All Departments':
            viewDepartments();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
        case 'Exit':
            exitApp();
            break;
        default:
            console.log(`Invalid action: ${action}`);
            break;
    }
}

// Functions for each case (View, Add, Update)
// Note: Only providing structure. You need to fill in with appropriate queries as per your database schema.

async function viewDepartments() {
    // Perform database query to view departments
    console.log('Departments:');
    // Use console.table to display results
    mainMenu(); // Return to main menu after action
}

// Include similar functions for viewing roles, employees, adding departments, roles, employees, and updating employee roles

// Exit application
async function exitApp() {
    console.log('Goodbye!');
    process.exit(0); // Exit the process
}

// Initialize application
mainMenu();

// For completeness in an Express app, though not required for CLI functionality
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
