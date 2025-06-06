const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const confirmationTokenSchema = new Schema(
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
    timestamps: false,
    versionKey: false,
  }
);

const ConfirmationToken = model('ConfirmationToken', confirmationTokenSchema);

module.exports = ConfirmationToken;
