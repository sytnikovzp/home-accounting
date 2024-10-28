const { Schema, model } = require('mongoose');

const tokensSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Token = model('Token', tokensSchema);

module.exports = Token;
