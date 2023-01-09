const connection = require('./connection');
const seedExample = require('../seed');

const example = {
  departmentName: 'Marketing',
  roleTitle: 'Marketing Manager',
  roleSalary: 80000,
  firstName: 'John',
  lastName: 'Doe'
};

seedExample(connection, example);