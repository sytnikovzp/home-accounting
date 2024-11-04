const { Schema, model } = require('mongoose');

const permissionsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Permission = model('Permission', permissionsSchema);

module.exports = Permission;
