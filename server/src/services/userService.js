const { User, Role } = require('../db/dbMongo/models');
const {
  hashPassword,
  emailToLowerCase,
  formatDate,
  checkPermission,
} = require('../utils/sharedFunctions');
const { badRequest, notFound, forbidden } = require('../errors/customErrors');
const { generateTokens } = require('./tokenService');

class UserService {
  async getAllUsers(limit, offset) {
    const foundUsers = await User.find().limit(limit).skip(offset);
    if (foundUsers.length === 0) throw notFound('Users not found');
    const allUsers = await Promise.all(
      foundUsers.map(async (user) => {
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
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('User not found');
    const role = await Role.findById(foundUser.roleId);
    const limitUserData = {
      id: foundUser._id,
      fullName: foundUser.fullName,
      role: role.title || '',
      photo: foundUser.photo || '',
    };
    const fullUserData = {
      ...limitUserData,
      email: foundUser.email,
      createdAt: formatDate(foundUser.createdAt),
      updatedAt: formatDate(foundUser.updatedAt),
    };
    if (
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'FULL_PROFILE_VIEWER'))
    ) {
      return fullUserData;
    }
    if (await checkPermission(currentUser, 'LIMITED_PROFILE_VIEWER')) {
      return limitUserData;
    }
  }

  async getCurrentUser(email) {
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) throw notFound('User not found');
    const role = await Role.findById(foundUser.roleId);
    return {
      id: foundUser._id,
      fullName: foundUser.fullName,
      role: role.title || '',
      photo: foundUser.photo || '',
      email: foundUser.email,
      createdAt: formatDate(foundUser.createdAt),
      updatedAt: formatDate(foundUser.updatedAt),
    };
  }

  async updateUser(id, fullName, email, password, role, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to update this user data');
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('User not found');
    const foundRole = await Role.findById(foundUser.roleId);
    if (!foundRole) throw badRequest('Role not found');
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email && email.toLowerCase() !== foundUser.email.toLowerCase()) {
      const newEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail) throw badRequest('This email is already used');
      updateData.email = newEmail;
    }
    if (password) updateData.password = await hashPassword(password);
    if (role && role !== foundRole.title) {
      const hasPermissionToChangeRole = await checkPermission(
        currentUser,
        'CHANGE_ROLES'
      );
      if (!hasPermissionToChangeRole)
        throw forbidden('You don`t have permission to change this user role');
      if (foundRole.title === 'Administrator') {
        const adminCount = await User.countDocuments({
          roleId: foundUser.roleId,
        });
        if (adminCount === 1)
          throw forbidden('Cannot delete the last administrator');
      }
      const newRole = await Role.findOne({ title: role });
      if (!newRole) throw notFound('Role not found');
      updateData.roleId = newRole._id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) throw badRequest('User is not updated');
    const tokens = generateTokens({
      email: updateData.email || foundUser.email,
    });
    return {
      ...tokens,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        role: role || (await Role.findById(foundUser.roleId)).title,
      },
    };
  }

  async updateUserPhoto(id, filename, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to update this user photo');
    if (!filename) throw badRequest('No file uploaded');
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('User not found');
    foundUser.photo = filename;
    const updatedUser = await foundUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async removeUserPhoto(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to remove this user photo');
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('User not found');
    foundUser.photo = null;
    const updatedUser = await foundUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async deleteUser(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete this user profile');
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('User not found');
    const foundRole = await Role.findById(foundUser.roleId);
    if (!foundRole) throw badRequest('Role not found');
    if (foundRole.title === 'Administrator') {
      const adminCount = await User.countDocuments({
        roleId: foundUser.roleId,
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
