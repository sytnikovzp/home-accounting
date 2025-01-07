const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const permissionsSchema = new Schema(
  {
    uuid: {
      type: Schema.Types.UUID,
      default: uuidv4,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);
const Permission = model('Permission', permissionsSchema);

module.exports = Permission;
