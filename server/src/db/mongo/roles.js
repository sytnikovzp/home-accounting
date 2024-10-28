const { Schema, model } = require('mongoose');

const rolesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Role = model('Role', rolesSchema);

module.export = Role;
