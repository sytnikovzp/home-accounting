const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const rolesSchema = new Schema(
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
    permissions: [{ type: Schema.Types.UUID, ref: 'Permission' }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Role = model('Role', rolesSchema);

module.exports = Role;
