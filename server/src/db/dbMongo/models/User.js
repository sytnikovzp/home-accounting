const { v4: uuidv4 } = require('uuid');
const { Schema, model } = require('mongoose');

const usersSchema = new Schema(
  {
    uuid: {
      type: Schema.Types.UUID,
      default: uuidv4,
      unique: true,
      required: true,
    },
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
    tokenVersion: {
      type: Number,
      default: 0,
    },
    photo: String,
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
    activationLink: String,
    roleUuid: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'Role',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User = model('User', usersSchema);

module.exports = User;
