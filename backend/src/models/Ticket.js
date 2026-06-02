const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const replySchema = new mongoose.Schema({
  message:  { type: String, required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAdmin:  { type: Boolean, default: false },
  screenshot: { type: String },
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  ticketId:    { type: String, unique: true },
  subject:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  screenshot:  { type: String },
  status:      { type: String, enum: ['Open','In Progress','Resolved','Closed'], default: 'Open' },
  priority:    { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  category:    { type: String, enum: ['Technical','Billing','General','Feature Request','Bug Report'], default: 'General' },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies:     [replySchema],
  resolvedAt:  { type: Date },
  closedAt:    { type: Date },
}, { timestamps: true });

ticketSchema.pre('save', function(next) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${nanoid(8).toUpperCase()}`;
  }
  next();
});

ticketSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
