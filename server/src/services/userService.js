const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const {
  hashPassword,
  emailToLowerCase,
  formatDate,
  checkPermission,
} = require('../utils/sharedFunctions');
// ==============================================================
const { generateTokens } = require('./tokenService');
// ==============================================================
const { badRequest, notFound, forbidden } = require('../errors/customErrors');

class UserService {
  async getAllUsers(limit, offset) {
    const findUsers = await User.find().limit(limit).skip(offset);
    if (findUsers.length === 0) throw notFound('Users not found');
    const allUsers = await Promise.all(
      findUsers.map(async (user) => {
        const role = await Role.findById(user.roleId);
        return {
          id: user._id,
          fullName: user.fullName,
          role: role.title || '',
          photo: user.photo || '',
        };
      })
    );
    const total = await User.countDocuments();
    return {
      allUsers,
      total,
    };
  }

  async getUserById(id, currentUser) {
    const findUser = await User.findById(id);
    if (!findUser) throw notFound('User not found');
    const role = await Role.findById(findUser.roleId);
    const limitUserData = {
      id: findUser._id,
      fullName: findUser.fullName,
      role: role.title || '',
      photo: findUser.photo || '',
    };
    const fullUserData = {
      ...limitUserData,
      email: findUser.email,
      createdAt: formatDate(findUser.createdAt),
      updatedAt: formatDate(findUser.updatedAt),
    };
    if (
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(
        currentUser,
        'UNLIMITED_VIEW_OF_OTHER_USERS_PROFILES'
      ))
    ) {
      return fullUserData;
    }
    if (
      await checkPermission(
        currentUser,
        'LIMITED_VIEWING_OF_OTHER_USER_PROFILES'
      )
    ) {
      return limitUserData;
    }
  }

  async getCurrentUser(email) {
    const emailToLower = emailToLowerCase(email);
    const findUser = await User.findOne({ email: emailToLower });
    if (!findUser) throw notFound('User not found');
    const role = await Role.findById(findUser.roleId);
    return {
      id: findUser._id,
      fullName: findUser.fullName,
      role: role.title || '',
      photo: findUser.photo || '',
      email: findUser.email,
      createdAt: formatDate(findUser.createdAt),
      updatedAt: formatDate(findUser.updatedAt),
    };
  }

  async updateUser(id, fullName, email, password, role, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'EDIT_OTHER_USERS_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to update this user data');
    const findUser = await User.findById(id);
    if (!findUser) throw notFound('User not found');
    const findRole = await Role.findById(findUser.roleId);
    if (!findRole) throw badRequest('Role not found');
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email && email.toLowerCase() !== findUser.email.toLowerCase()) {
      const newEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail) throw badRequest('This email is already used');
      updateData.email = newEmail;
    }
    if (password) updateData.password = await hashPassword(password);
    if (role && role !== findRole.title) {
      const hasPermission = await checkPermission(currentUser, 'CHANGE_ROLES');
      if (!hasPermission)
        throw forbidden('You don`t have permission to change this user role');
      if (findRole.title === 'Administrator') {
        const adminCount = await User.countDocuments({
          roleId: findUser.roleId,
        });
        if (adminCount === 1)
          throw forbidden('Cannot delete the last administrator');
      }
      const findRole = await Role.findOne({ title: role });
      if (!findRole) throw notFound('Role not found');
      updateData.roleId = findRole._id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) throw badRequest('User is not updated');
    const tokens = generateTokens({
      email: updateData.email || findUser.email,
    });
    return {
      ...tokens,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        role: role || (await Role.findById(findUser.roleId)).title,
      },
    };
  }

  async updateUserPhoto(id, filename, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'EDIT_OTHER_USERS_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to update this user photo');
    if (!filename) throw badRequest('No file uploaded');
    const findUser = await User.findById(id);
    if (!findUser) throw notFound('User not found');
    findUser.photo = filename;
    const updatedUser = await findUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async removeUserPhoto(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'EDIT_OTHER_USERS_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to remome this user photo');
    const findUser = await User.findById(id);
    if (!findUser) throw notFound('User not found');
    findUser.photo = null;
    const updatedUser = await findUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async deleteUser(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'DELETE_OTHER_USERS_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete this user profile');
    const findUser = await User.findById(id);
    if (!findUser) throw notFound('User not found');
    const findRole = await Role.findById(findUser.roleId);
    if (!findRole) throw badRequest('Role not found');
    if (findRole.title === 'Administrator') {
      const adminCount = await User.countDocuments({
        roleId: findUser.roleId,
      });
      if (adminCount === 1)
        throw forbidden('Can`t delete the last administrator');
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw badRequest('User is not deleted');
    return deletedUser;
  }
}

module.exports = new UserService();
