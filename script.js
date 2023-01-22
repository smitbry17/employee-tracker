const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./public/index");
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
function quit() {
  console.log("Goodbye!");
  process.exit();
}
