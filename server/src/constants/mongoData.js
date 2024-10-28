module.exports.roles = [
  {
    title: 'admin',
    description: 'He can do everything',
  },
  {
    title: 'moderator',
    description: 'He keep order',
  },
  {
    title: 'customer',
    description: 'He use application',
  },
];

module.exports.users = async (roleIds) => [
  {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    password: 'Qwerty12',
    roleId: roleIds['admin'],
  },
  {
    fullName: 'Jane Smith',
    email: 'jane.smith@gmail.com',
    password: 'Qwerty12',
    roleId: roleIds['customer'],
  },
];
