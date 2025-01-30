/* eslint-disable sort-keys-fix/sort-keys-fix */
const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const verificationTokenSchema = new Schema(
  {
    userUuid: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 24 * 60 * 60 * 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const VerificationToken = model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;
