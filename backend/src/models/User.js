const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6, select: false },
  role:          { type: String, enum: ['admin','affiliate'], default: 'affiliate' },
  phone:         { type: String },
  bio:           { type: String },
  avatar:        { type: String, default: '' },
  isActive:      { type: Boolean, default: true },
  affiliateCode: { type: String, unique: true, sparse: true },
  lastLogin:     { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre('save', function(next) {
  if (!this.affiliateCode && this.isNew)
    this.affiliateCode = 'AFF-' + Math.random().toString(36).substr(2,8).toUpperCase();
  next();
});
userSchema.methods.comparePassword = async function(p) { return bcrypt.compare(p, this.password); };
userSchema.methods.toJSON = function() { const o = this.toObject(); delete o.password; return o; };

module.exports = mongoose.model('User', userSchema);
