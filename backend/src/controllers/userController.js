const User   = require('../models/User');
const Lead   = require('../models/Lead');
const Ticket = require('../models/Ticket');

const getUsers = async (req, res, next) => {
  try {
    const { role, search, page=1, limit=10 } = req.query;
    const q = {};
    if (role)   q.role = role;
    if (search) q.$or = [{ name:{$regex:search,$options:'i'} },{ email:{$regex:search,$options:'i'} }];
    const total = await User.countDocuments(q);
    const users = await User.find(q).sort({ createdAt:-1 }).skip((page-1)*limit).limit(+limit);
    res.json({ success:true, data:users, pagination:{ total, page:+page, limit:+limit, pages:Math.ceil(total/limit) } });
  } catch(e) { next(e); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success:false, message:'User not found' });
    const [totalLeads, convertedLeads, activeTickets] = await Promise.all([
      Lead.countDocuments({ assignedAffiliate:user._id }),
      Lead.countDocuments({ assignedAffiliate:user._id, status:'Converted' }),
      Ticket.countDocuments({ user:user._id, status:{ $in:['Open','In Progress'] } }),
    ]);
    res.json({ success:true, data:{ ...user.toJSON(), stats:{ totalLeads, convertedLeads, activeTickets } } });
  } catch(e) { next(e); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, bio, avatar }, { new:true, runValidators:true });
    res.json({ success:true, message:'Profile updated', user });
  } catch(e) { next(e); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if (!user) return res.status(404).json({ success:false, message:'User not found' });
    res.json({ success:true, data:user });
  } catch(e) { next(e); }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success:false, message:'User not found' });
    if (user._id.toString() === req.user._id.toString()) return res.status(400).json({ success:false, message:'Cannot delete yourself' });
    await user.deleteOne();
    res.json({ success:true, message:'User deleted' });
  } catch(e) { next(e); }
};

const getAffiliates = async (req, res, next) => {
  try {
    const affiliates = await User.find({ role:'affiliate', isActive:true }).select('name email affiliateCode').sort({ name:1 });
    res.json({ success:true, data:affiliates });
  } catch(e) { next(e); }
};

module.exports = { getUsers, getUserById, updateProfile, updateUser, deleteUser, getAffiliates };
