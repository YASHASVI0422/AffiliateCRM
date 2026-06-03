const User         = require('../models/User');
const Activity     = require('../models/Activity');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success:false, message:'Email already exists' });
    const role = (await User.countDocuments()) === 0 ? 'admin' : 'affiliate';
    const user = await User.create({ name, email, password, role });
    await Activity.create({ user:user._id, type:'user_registered', description:`${user.name} registered`, entityId:user._id, entityType:'User' });
    res.status(201).json({ success:true, token:generateToken(user._id), user:{ _id:user._id, name:user.name, email:user.email, role:user.role, affiliateCode:user.affiliateCode } });
  } catch(e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:'Please provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success:false, message:'Invalid email or password' });
    if (!user.isActive) return res.status(401).json({ success:false, message:'Account deactivated' });
    user.lastLogin = new Date(); await user.save({ validateBeforeSave:false });
    await Activity.create({ user:user._id, type:'user_login', description:`${user.name} logged in`, entityId:user._id, entityType:'User' });
    res.json({ success:true, token:generateToken(user._id), user:{ _id:user._id, name:user.name, email:user.email, role:user.role, affiliateCode:user.affiliateCode, phone:user.phone, bio:user.bio, avatar:user.avatar, createdAt:user.createdAt } });
  } catch(e) { next(e); }
};

const getMe = async (req, res, next) => {
  try { res.json({ success:true, user: await User.findById(req.user._id) }); } catch(e) { next(e); }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ success:false, message:'Current password incorrect' });
    user.password = newPassword; await user.save();
    res.json({ success:true, message:'Password updated', token:generateToken(user._id) });
  } catch(e) { next(e); }
};

const TokenBlacklist = require('../models/TokenBlacklist');

const logout = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      await TokenBlacklist.findOneAndUpdate({ token }, { token }, { upsert: true });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login, getMe, updatePassword, logout };
