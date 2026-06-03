const Ticket   = require('../models/Ticket');
const Activity = require('../models/Activity');

const populate = q => q.populate('user','name email role').populate('assignedTo','name email').populate('replies.author','name role');

const getTickets = async (req, res, next) => {
  try {
    const { status, priority, page=1, limit=10, search } = req.query;
    const q = {};
    if (req.user.role !== 'admin') q.user = req.user._id;
    if (status)   q.status   = status;
    if (priority) q.priority = priority;
    if (search)   q.$or = [{ subject:{$regex:search,$options:'i'} },{ ticketId:{$regex:search,$options:'i'} }];
    const total   = await Ticket.countDocuments(q);
    const tickets = await populate(Ticket.find(q).sort({ createdAt:-1 }).skip((page-1)*limit).limit(+limit));
    res.json({ success:true, data:tickets, pagination:{ total, page:+page, limit:+limit, pages:Math.ceil(total/limit) } });
  } catch(e) { next(e); }
};

const getTicket = async (req, res, next) => {
  try {
    const ticket = await populate(Ticket.findById(req.params.id));
    if (!ticket) return res.status(404).json({ success:false, message:'Ticket not found' });
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Access denied' });
    res.json({ success:true, data:ticket });
  } catch(e) { next(e); }
};

const createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({ ...req.body, user:req.user._id });
    await Activity.create({ user:req.user._id, type:'ticket_created', description:`Ticket: ${ticket.subject}`, entityId:ticket._id, entityType:'Ticket' });
    res.status(201).json({ success:true, message:'Ticket created', data: await populate(Ticket.findById(ticket._id)) });
  } catch(e) { next(e); }
};

const updateTicket = async (req, res, next) => {
  try {
    if (!await Ticket.findById(req.params.id)) return res.status(404).json({ success:false, message:'Ticket not found' });
    if (req.body.status === 'Resolved') req.body.resolvedAt = new Date();
    if (req.body.status === 'Closed')   req.body.closedAt   = new Date();
    const updated = await populate(Ticket.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true }));
    res.json({ success:true, message:'Ticket updated', data:updated });
  } catch(e) { next(e); }
};

const replyToTicket = async (req, res, next) => {
  try {
    const { message, screenshot } = req.body;
    if (!message) return res.status(400).json({ success:false, message:'Message required' });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success:false, message:'Ticket not found' });
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success:false, message:'Access denied' });
    ticket.replies.push({ message, author:req.user._id, isAdmin: req.user.role === 'admin', screenshot });
    if (req.user.role === 'admin' && ticket.status === 'Open') ticket.status = 'In Progress';
    await ticket.save();
    await Activity.create({ user:req.user._id, type:'ticket_replied', description:`Reply on ${ticket.ticketId}`, entityId:ticket._id, entityType:'Ticket' });
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io && req.user.role === 'admin') {
      io.to(ticket.user.toString()).emit('ticket_reply_received', {
        ticketId: ticket._id,
        message: `Support replied to ticket ${ticket.ticketId}`
      });
    }
    
    res.json({ success:true, message:'Reply added', data: await populate(Ticket.findById(ticket._id)) });
  } catch(e) { next(e); }
};

const getTicketStats = async (req, res, next) => {
  try {
    const q = req.user.role === 'affiliate' ? { user:req.user._id } : {};
    const byStatus   = await Ticket.aggregate([{ $match:q },{ $group:{ _id:'$status',   count:{ $sum:1 } } }]);
    const byPriority = await Ticket.aggregate([{ $match:q },{ $group:{ _id:'$priority', count:{ $sum:1 } } }]);
    res.json({ success:true, data:{ total: await Ticket.countDocuments(q), byStatus, byPriority } });
  } catch(e) { next(e); }
};

module.exports = { getTickets, getTicket, createTicket, updateTicket, replyToTicket, getTicketStats };
