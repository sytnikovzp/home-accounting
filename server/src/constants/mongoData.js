module.exports.roles = [
  {
    title: 'Administrator',
    description: 'He can do everything',
  },
  {
    title: 'Moderator',
    description: 'He keep order',
  },
  {
    title: 'Customer',
    description: 'He use application',
  },
];

module.exports.users = async (roleIds) => [
  {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'Qwerty12',
    roleId: roleIds['Administrator'],
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    password: 'Qwerty12',
    roleId: roleIds['Customer'],
  },
];
