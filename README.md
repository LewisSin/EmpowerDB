# Employee Management System

## Description

This Employee Management System is a command-line application that allows business owners to view, manage, and update employee records within their company. Built with Node.js, this application utilizes Inquirer for user prompts and MySQL for data management, providing an efficient way to handle departments, roles, and employee information.

## Demo

For a detailed walkthrough of EmpowerDB, check out our [demo video](https://drive.google.com/file/d/1WTcPFgX4jJLuXDnvaWxVpHKdx3mM4owP/preview).


## Installation

Before installing, ensure you have Node.js and MySQL installed on your system. Then, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://your-repository-url-here.git
cd employee-management-system
```
2. Install the required Node.js packages:
- npm install

3. Set up your MySQL database by executing the schema and seed SQL scripts located in the `db` directory. Log into your MySQL command line tool and run:
- SOURCE db/schema.sql;

4. Then seed the database
- SOURCE db/seeds.sql;

5. Create a `.env` file in the root directory of your project to store your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_database
```
Make sure to replace your_mysql_password with the actual password for your MySQL root user.

## Usage

Start the application with the following command:
```
npm start
```
Navigate through the interactive menu to manage your company's employee database. Options include viewing all departments, roles, and employees, adding new records, and updating existing employee roles.

## Features
- Comprehensive management of departments, roles, and employees
- Interactive command-line interface
- Seamless integration with MySQL for data persistence

## Contributing

We welcome contributions to EmpowerDB. Please feel free to fork the repository, make your changes, and submit a pull request for review.

## Acknowledgments
- Node.js
- MySQL
- Inquirer.js
- dotenv

## Links
- Repo: https://github.com/LewisSin/EmpowerDB