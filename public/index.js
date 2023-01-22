const connection = require("./connection");
class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findAllEmployees() {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  }

  findAllPossibleManagers(employeeId) {
    return this.connection
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
      );
  }

  createEmployee() {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", employee);
  }

  findAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT department.name, department.id FROM department");
  }
  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT role.salary, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id"
      );
  }

  
}

module.exports = new DB(connection);
