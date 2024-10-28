const bcrypt = require('bcrypt');
// =====================================
const { User } = require('../db/dbMongo/models');

class AuthService {
  async registration(fullName, email, password) {
    const person = await User.findOne({ email });

    if (person) {
      throw new Error('This user already exists!');
    }

    const user = await User.create({ fullName, email, password });

    console.log(user);
  }
}

module.exports = AuthService;
