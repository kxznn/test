const mongoose = require("mongoose");

const TechnicalSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Remove _id e usa id no JSON
TechnicalSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model("Technical", TechnicalSchema);