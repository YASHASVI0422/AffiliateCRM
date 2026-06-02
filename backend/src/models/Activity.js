const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['lead_created','lead_updated','lead_converted','ticket_created','ticket_updated','ticket_replied','user_login','user_registered'], required: true },
  description: { type: String, required: true },
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
  entityId:    { type: mongoose.Schema.Types.ObjectId },
  entityType:  { type: String, enum: ['Lead','Ticket','User'] },
}, { timestamps: true });

activitySchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Activity', activitySchema);
