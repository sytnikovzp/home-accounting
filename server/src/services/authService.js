const bcrypt = require('bcrypt');
// ====================================================
const { User } = require('../db/dbMongo/models');
const tokenService = require('./tokenService');

class AuthService {
  async registration(fullName, email, password) {
    const person = await User.findOne({ email });

    if (person) {
      throw new Error('This user already exists!');
    }

    const user = await User.create({ fullName, email, password });

    console.log('New user is: ------------------', user);

    const tokens = tokenService.generateTokens({ email });

    const userId = user._id;

    await tokenService.saveToken(userId, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: userId,
        email,
      },
    };
  }
}

module.exports = new AuthService();
