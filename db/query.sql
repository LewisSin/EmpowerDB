
SELECT
role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id;

SELECT
employee.id, employee.first_name, employee.last_name, role.title AS title, role.salary AS salary, department.name AS department, manager.first_name AS manager_firstName, manager.last_name AS manager_lastName 
FROM employee LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id 
LEFT JOIN employee manager ON manager.id = employee.manager_id;