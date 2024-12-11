const { Schema, model } = require('mongoose');

const usersSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: String,
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
    activationLink: String,
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User = model('User', usersSchema);

module.exports = User;
