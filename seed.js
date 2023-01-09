function seedExample(connection, example) {
  // Insert data into department table
  connection.query(
    "INSERT INTO department (name) VALUES (?)",
    [example.departmentName],
    function (err, results) {
      if (err) throw err;
      console.log(results);
    }
  );

  // Insert data into role table
  connection.query(
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))",
    [example.roleTitle, example.roleSalary, example.departmentName],
    function (err, results) {
      if (err) throw err;
      console.log(results);
    }
  );

  // Insert data into employee table
  connection.query(
    "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, (SELECT id FROM role WHERE title = ?))",
    [example.firstName, example.lastName, example.roleTitle],
    function (err, results) {
      if (err) throw err;
      console.log(results);
    }
  );

  connection.end();
}

module.exports = seedExample;
