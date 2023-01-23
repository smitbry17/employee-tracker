const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./public/index");
const { updateEmployeeRole, updateEmployeeManager } = require("./public/index");
require("console.table");

init();

function init() {
  const logoRender = logo({ name: "Employee Manager" }).render();

  console.log(logoRender);

  loadPrompts();
}
function loadPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "Select what you would like to do.",
      choices: [
        {
          name: "Show Roles",
          value: "SHOW_ALL_ROLES",
        },
        {
          name: "Show Employees",
          value: "SHOW_ALL_EMPLOYEES",
        },
        {
          name: "Show Departments",
          value: "SHOW_ALL_DEPARTMENTS",
        },
        {
          name: "Update Employees Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Add Role",
          value: "ADD_ROLE",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case "SHOW_ALL_ROLES":
        showRoles();
        break;
      case "SHOW_ALL_EMPLOYEES":
        showEmployees();
        break;
      case "SHOW_ALL_DEPARTMENTS":
        showDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateManager();
        break;
      default:
        quit();
    }
  });
}

function showRoles() {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => loadPrompts());
}
function showEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employee = rows;
      console.table(employee);
    })
    .then(() => loadPrompts());
}
function showDepartments() {
  db.findAllDepartments()
    .then(([rows]) => {
      let department = rows;
      console.table(department);
    })
    .then(() => loadPrompts());
}
function updateManager() {
  db.findAllEmployees().then(([rows]) => {
    let employee = rows;
    const employeeChoice = employee.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's manager would you like to change?",
        choices: employeeChoice,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllPossibleManagers(employeeId).then(([rows]) => {
        let managers = rows;
        const managerChoice = managers.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        }));
        managerChoice.unshift({ name: "None", value: null });
        prompt([
          {
            type: "list",
            name: "managerId",
            message: "Which manager would you like to assign to this employee?",
            choices: managerChoice,
          },
        ])
          .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
          .then(() => console.log("Employee's manager has been updated"))
          .then(() => loadPrompts());
      });
    });
  });
}

function updateRole() {
  db.findAllEmployees().then(([rows]) => {
    let employee = rows;
    const employeeChoice = employee.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role would you like to change?",
        choices: employeeChoice,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(([rows]) => {
        let roles = rows;
        const roleChoice = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        prompt([
          {
            type: "list",
            name: "roleId",
            message: "What role would you like to give them?",
            choices: roleChoice,
          },
        ])
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Employee role has been updated"))
          .then(() => loadPrompts());
      });
    });
  });
}

function addRole() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoice = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    prompt([
      {
        name: "title",
        message: "What is the new roles name?",
      },
      {
        name: "salary",
        message: "What is the role's salary?",
      },
      {
        type: "list",
        name: "department_id",
        message: "What is this role's department?",
        choices: departmentChoice,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => loadPrompts());
    });
  });
}
function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]).then((res) => {
    let dep = res;
    db.createDepartment(dep)
      .then(() => console.log(`New department ${dep.name} has been created`))
      .then(() => loadPrompts());
  });
}
function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]).then((res) => {
    firstName = res.first_name;
    lastName = res.last_name;

    db.findAllRoles().then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
      prompt([
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleChoices,
        },
      ]).then((res) => {
        let roleId = res.roleId;
        db.findAllEmployees().then(([rows]) => {
          let employees = rows;
          const managerChoice = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );
          managerChoice.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is this employee's manager?",
            choices: managerChoice,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
              };
              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`)
            )
            .then(() => loadPrompts());
        });
      });
    });
  });
}
function quit() {
  console.log("Goodbye!");
  process.exit();
}
