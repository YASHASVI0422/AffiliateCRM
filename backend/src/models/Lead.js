const mongoose = require('mongoose');
const leadSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  email:             { type: String, required: true, lowercase: true },
  phone:             { type: String },
  company:           { type: String },
  source:            { type: String, enum: ['Website','Referral','Social Media','Email Campaign','Cold Call','Event','Other'], default: 'Other' },
  status:            { type: String, enum: ['New Lead','Contacted','Interested','Joined Community','Converted'], default: 'New Lead' },
  assignedAffiliate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes:             { type: String },
  value:             { type: Number, default: 0 },
  createdBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  convertedAt:       { type: Date },
  followUpDate:      { type: Date },
  followUpNote:      { type: String },
}, { timestamps: true });

leadSchema.index({ name: 'text', email: 'text', company: 'text' });
leadSchema.index({ assignedAffiliate: 1, status: 1, createdAt: -1 });
leadSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
