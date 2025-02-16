const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
    emailVerified: {
      type: String,
      enum: ['pending', 'verified'],
      required: true,
      default: 'pending',
    },
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
