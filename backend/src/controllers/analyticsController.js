const Lead     = require('../models/Lead');
const Ticket   = require('../models/Ticket');
const User     = require('../models/User');
const Activity = require('../models/Activity');

const getOverview = async (req, res, next) => {
  try {
    const isAff = req.user.role === 'affiliate';
    const qLeads = isAff ? { $or: [{ assignedAffiliate: req.user._id }, { createdBy: req.user._id }] } : {};
    const qTickets = isAff ? { user: req.user._id } : {};

    const [totalLeads, totalTickets, totalUsers, convertedLeads, openTickets, newLeadsToday] = await Promise.all([
      Lead.countDocuments(qLeads),
      Ticket.countDocuments(qTickets),
      User.countDocuments({ role: 'affiliate' }),
      Lead.countDocuments({ ...qLeads, status: 'Converted' }),
      Ticket.countDocuments({ ...qTickets, status: { $in: ['Open', 'In Progress'] } }),
      Lead.countDocuments({ ...qLeads, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        totalTickets,
        totalUsers,
        convertedLeads,
        openTickets,
        newLeadsToday,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0
      }
    });
  } catch(e) { next(e); }
};

const getLeadsOverTime = async (req, res, next) => {
  try {
    const days = +req.query.days || 30;
    const start = new Date(); 
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const q = req.user.role === 'affiliate' 
      ? { $or: [{ assignedAffiliate: req.user._id }, { createdBy: req.user._id }] }
      : {};

    const dbData = await Lead.aggregate([
      { $match: { ...q, createdAt: { $gte: start } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' }, d: { $dayOfMonth: '$createdAt' } }, count: { $sum: 1 }, converted: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } } } },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);

    const dataMap = new Map();
    dbData.forEach(d => {
      const key = `${d._id.y}-${String(d._id.m).padStart(2, '0')}-${String(d._id.d).padStart(2, '0')}`;
      dataMap.set(key, { leads: d.count, converted: d.converted });
    });

    const result = [];
    for (let i = 0; i <= days; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      
      if (dataMap.has(key)) {
        result.push({ date: key, ...dataMap.get(key) });
      } else {
        result.push({ date: key, leads: 0, converted: 0 });
      }
    }

    res.json({ success: true, data: result });
  } catch(e) { next(e); }
};


const getPipelineData = async (req, res, next) => {
  try {
    const q = req.user.role === 'affiliate' ? { assignedAffiliate:req.user._id } : {};
    const p = await Lead.aggregate([{ $match:q },{ $group:{ _id:'$status', count:{ $sum:1 } } }]);
    const ordered = ['New Lead','Contacted','Interested','Joined Community','Converted'].map(s => ({ status:s, count: p.find(x=>x._id===s)?.count||0 }));
    res.json({ success:true, data:ordered });
  } catch(e) { next(e); }
};

const getAffiliatePerformance = async (req, res, next) => {
  try {
    const data = await Lead.aggregate([
      { $match:{ assignedAffiliate:{ $exists:true,$ne:null } } },
      { $group:{ _id:'$assignedAffiliate', totalLeads:{ $sum:1 }, converted:{ $sum:{ $cond:[{ $eq:['$status','Converted'] },1,0] } } } },
      { $lookup:{ from:'users', localField:'_id', foreignField:'_id', as:'affiliate' } },
      { $unwind:'$affiliate' },
      { $project:{ name:'$affiliate.name', email:'$affiliate.email', avatar:'$affiliate.avatar', affiliateCode:'$affiliate.affiliateCode', totalLeads:1, converted:1, conversionRate:{ $multiply:[{ $divide:['$converted','$totalLeads'] },100] } } },
      { $sort:{ converted:-1 } },
    ]);
    res.json({ success:true, data });
  } catch(e) { next(e); }
};

const getActivity = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { entityType, type } = req.query;
    let q = {};
    if (entityType && entityType !== 'All') q.entityType = entityType;
    if (type && type !== 'All') q.type = type;

    if (req.user.role === 'affiliate') {
      const [myLeads, myTickets] = await Promise.all([
        Lead.find({ $or: [{ assignedAffiliate: req.user._id }, { createdBy: req.user._id }] }).select('_id'),
        Ticket.find({ user: req.user._id }).select('_id')
      ]);
      const myLeadIds = myLeads.map(l => l._id);
      const myTicketIds = myTickets.map(t => t._id);

      q.user = { $ne: req.user._id };
      if (type && type !== 'All') {
        q.type = type;
      } else {
        q.type = { $nin: ['user_login', 'user_registered'] };
      }
      q.$or = [
        { entityType: 'Lead', entityId: { $in: myLeadIds } },
        { entityType: 'Ticket', entityId: { $in: myTicketIds } }
      ];
    }
    const total = await Activity.countDocuments(q);
    const activities = await Activity.find(q)
      .populate('user','name email role')
      .sort({ createdAt:-1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch(e) { next(e); }
};

const getTicketTrends = async (req, res, next) => {
  try {
    const q = req.user.role === 'affiliate' ? { user: req.user._id } : {};
    const [byStatus, byPriority, byCategory] = await Promise.all([
      Ticket.aggregate([{ $match: q }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: q }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: q }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, data: { byStatus, byPriority, byCategory } });
  } catch(e) { next(e); }
};

module.exports = { getOverview, getLeadsOverTime, getPipelineData, getAffiliatePerformance, getActivity, getTicketTrends };
