const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({

  machine: { type: mongoose.Schema.Types.ObjectId, ref: 'machine', required: true },

  technical: { type: mongoose.Schema.Types.ObjectId, ref: 'technical', required: true },
  date: { type: String, required: true },
  status: { type: String, required: true, default: 'Pending' }
});

MaintenanceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);