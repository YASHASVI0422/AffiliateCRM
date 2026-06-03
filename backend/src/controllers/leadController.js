const Lead     = require('../models/Lead');
const Activity = require('../models/Activity');
const { Parser } = require('json2csv');

const getLeads = async (req, res, next) => {
  try {
    const { status, source, search, page=1, limit=10, followUpToday } = req.query;
    const q = {};
    if (req.user.role === 'affiliate') q.assignedAffiliate = req.user._id;
    if (status) q.status = status;
    if (source) q.source = source;
    if (search) q.$or = [{ name:{$regex:search,$options:'i'} },{ email:{$regex:search,$options:'i'} },{ company:{$regex:search,$options:'i'} }];
    
    if (followUpToday === 'true') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      q.followUpDate = { $gte: start, $lte: end };
    }

    const total = await Lead.countDocuments(q);
    const leads = await Lead.find(q).populate('assignedAffiliate','name email affiliateCode').populate('createdBy','name email').sort({ createdAt:-1 }).skip((page-1)*limit).limit(+limit);
    res.json({ success:true, data:leads, pagination:{ total, page:+page, limit:+limit, pages:Math.ceil(total/limit) } });
  } catch(e) { next(e); }
};

const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedAffiliate','name email affiliateCode').populate('createdBy','name');
    if (!lead) return res.status(404).json({ success:false, message:'Lead not found' });
    res.json({ success:true, data:lead });
  } catch(e) { next(e); }
};

const createLead = async (req, res, next) => {
  try {
    const leadData = { ...req.body, createdBy: req.user._id };
    if (req.user.role === 'affiliate') {
      leadData.assignedAffiliate = req.user._id;
    }
    const lead = await Lead.create(leadData);
    await Activity.create({ user:req.user._id, type:'lead_created', description:`Lead created: ${lead.name}`, entityId:lead._id, entityType:'Lead' });
    const pop = await Lead.findById(lead._id).populate('assignedAffiliate','name email affiliateCode').populate('createdBy','name');
    res.status(201).json({ success:true, message:'Lead created', data:pop });
  } catch(e) { next(e); }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success:false, message:'Lead not found' });

    if (req.user.role === 'affiliate') {
      if (lead.assignedAffiliate?.toString() !== req.user._id.toString() && lead.createdBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success:false, message:'Not authorized to update this lead' });
      }
      delete req.body.assignedAffiliate;
    }

    if (req.body.status === 'Converted' && lead.status !== 'Converted') req.body.convertedAt = new Date();
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true }).populate('assignedAffiliate','name email affiliateCode').populate('createdBy','name');
    const type = req.body.status === 'Converted' ? 'lead_converted' : 'lead_updated';
    await Activity.create({ user:req.user._id, type, description:`Lead ${updated.name} → ${updated.status}`, entityId:updated._id, entityType:'Lead' });
    
    // Emit real-time notification on status changes
    if (req.body.status && req.body.status !== lead.status && updated.assignedAffiliate) {
      const io = req.app.get('io');
      if (io) {
        io.to(updated.assignedAffiliate._id.toString()).emit('lead_status_changed', {
          leadId: updated._id,
          leadName: updated.name,
          status: updated.status,
          message: `Lead ${updated.name} status updated to ${updated.status}`
        });
      }
    }

    res.json({ success:true, message:'Lead updated', data:updated });
  } catch(e) { next(e); }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success:false, message:'Lead not found' });

    if (req.user.role === 'affiliate' && lead.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success:false, message:'Not authorized to delete this lead' });
    }

    await lead.deleteOne();
    res.json({ success:true, message:'Lead deleted' });
  } catch(e) { next(e); }
};

const getLeadStats = async (req, res, next) => {
  try {
    const q = req.user.role === 'affiliate' ? { assignedAffiliate:req.user._id } : {};
    const byStatus = await Lead.aggregate([{ $match:q },{ $group:{ _id:'$status', count:{ $sum:1 } } }]);
    const total    = await Lead.countDocuments(q);
    const converted = byStatus.find(s => s._id === 'Converted')?.count || 0;
    res.json({ success:true, data:{ total, byStatus, converted, conversionRate: total>0 ? ((converted/total)*100).toFixed(1) : 0 } });
  } catch(e) { next(e); }
};

const exportLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({}).populate('assignedAffiliate', 'name');
    
    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Company', value: 'company' },
      { label: 'Source', value: 'source' },
      { label: 'Status', value: 'status' },
      { label: 'Value', value: 'value' },
      { label: 'Assigned Affiliate', value: (row) => row.assignedAffiliate ? row.assignedAffiliate.name : '' },
      { label: 'Created At', value: (row) => row.createdAt ? new Date(row.createdAt).toISOString() : '' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, getLeadStats, exportLeads };
