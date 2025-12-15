const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  models: { type: String, required: false }, 
  type: { type: String, required: true }      
});

MachineSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model("Machine", MachineSchema);