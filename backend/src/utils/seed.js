const mongoose = require('mongoose');
require('dotenv').config();
const User     = require('../models/User');
const Lead     = require('../models/Lead');
const Ticket   = require('../models/Ticket');
const Activity = require('../models/Activity');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/affiliate-crm');
  console.log('✅ MongoDB connected');
  await Promise.all([User.deleteMany(), Lead.deleteMany(), Ticket.deleteMany(), Activity.deleteMany()]);
  console.log('🗑️  Cleared data');

  const admin = await User.create({ name:'Alex Johnson', email:'admin@affiliatecrm.com', password:'admin123', role:'admin', phone:'+1-555-000-0001' });
  const affs  = await Promise.all([
    User.create({ name:'Sarah Williams', email:'sarah@affiliatecrm.com',  password:'affiliate123', role:'affiliate' }),
    User.create({ name:'Marcus Chen',    email:'marcus@affiliatecrm.com', password:'affiliate123', role:'affiliate' }),
    User.create({ name:'Priya Sharma',   email:'priya@affiliatecrm.com',  password:'affiliate123', role:'affiliate' }),
  ]);

  const leadData = [
    { name:'Jordan Blake',    email:'jordan@ex.com',   company:'TechVentures', status:'Converted',        source:'Referral',       value:1200 },
    { name:'Emma Davis',      email:'emma@ex.com',     company:'StartupCo',    status:'Interested',       source:'Website',        value:800  },
    { name:'Liam Torres',     email:'liam@ex.com',     company:'GrowthHub',    status:'Joined Community', source:'Social Media',   value:950  },
    { name:'Olivia Park',     email:'olivia@ex.com',   company:'NexGen Ltd',   status:'Contacted',        source:'Email Campaign', value:600  },
    { name:'Noah Martinez',   email:'noah@ex.com',     company:'CloudScale',   status:'New Lead',         source:'Cold Call',      value:0    },
    { name:'Ava Thompson',    email:'ava@ex.com',      company:'DataPeak',     status:'Converted',        source:'Event',          value:1500 },
    { name:'Ethan Wilson',    email:'ethan@ex.com',    company:'BizFlow',      status:'Interested',       source:'Referral',       value:750  },
    { name:'Isabella Moore',  email:'isabella@ex.com', company:'AgileWorks',   status:'Contacted',        source:'Website',        value:400  },
    { name:'William Lee',     email:'william@ex.com',  company:'TechPro',      status:'Converted',        source:'Social Media',   value:2000 },
    { name:'Sophie Anderson', email:'sophie@ex.com',   company:'InnovateCo',   status:'New Lead',         source:'Referral',       value:0    },
    { name:'James Taylor',    email:'james@ex.com',    company:'SwiftOps',     status:'Joined Community', source:'Email Campaign', value:1100 },
    { name:'Mia Jackson',     email:'mia@ex.com',      company:'PulseMedia',   status:'Interested',       source:'Cold Call',      value:650  },
  ];

  const leads = await Promise.all(leadData.map((l, i) => Lead.create({
    ...l, phone:`+1-555-20${i}-0001`, assignedAffiliate: affs[i % 3]._id,
    createdBy: admin._id, notes: 'Initial contact made.',
    convertedAt: l.status === 'Converted' ? new Date() : undefined,
  })));
  console.log(`✅ ${leads.length} leads created`);

  const tickets = await Promise.all([
    Ticket.create({ subject:'Cannot access dashboard',       description:'Getting 403 error on affiliate dashboard.', priority:'High',   category:'Technical',       status:'Open',        user: affs[0]._id }),
    Ticket.create({ subject:'Commission not showing',        description:'Referred user signed up but 0 commission.', priority:'High',   category:'Billing',         status:'In Progress', user: affs[1]._id, assignedTo: admin._id, replies:[{ message:'We are looking into this now.', author: admin._id, isAdmin: true }] }),
    Ticket.create({ subject:'How to generate referral link', description:'New to platform, need help with links.',     priority:'Low',    category:'General',         status:'Resolved',    user: affs[2]._id, resolvedAt: new Date(), replies:[{ message:'Go to Settings and copy your affiliate code!', author: admin._id, isAdmin: true }] }),
    Ticket.create({ subject:'Request bulk CSV upload',       description:'Would love CSV lead upload feature.',        priority:'Medium', category:'Feature Request', status:'Open',        user: affs[0]._id }),
    Ticket.create({ subject:'Profile update not saving',     description:'Phone number reverts after page refresh.',   priority:'Medium', category:'Bug Report',      status:'In Progress', user: affs[1]._id }),
    Ticket.create({ subject:'Lead status not updating',      description:'Changed to Interested but shows New Lead.',  priority:'High',   category:'Bug Report',      status:'Open',        user: affs[2]._id }),
  ]);
  console.log(`✅ ${tickets.length} tickets created`);

  await Activity.insertMany([
    { user: admin._id,   type:'user_registered', description:'Admin account created',              entityId: admin._id,   entityType:'User' },
    { user: affs[0]._id, type:'user_registered', description:`${affs[0].name} registered`,         entityId: affs[0]._id, entityType:'User' },
    { user: affs[1]._id, type:'user_registered', description:`${affs[1].name} registered`,         entityId: affs[1]._id, entityType:'User' },
    { user: admin._id,   type:'lead_created',    description:`Lead created: ${leads[0].name}`,     entityId: leads[0]._id, entityType:'Lead' },
    { user: admin._id,   type:'lead_converted',  description:`Lead converted: ${leads[0].name}`,   entityId: leads[0]._id, entityType:'Lead' },
    { user: admin._id,   type:'lead_converted',  description:`Lead converted: ${leads[5].name}`,   entityId: leads[5]._id, entityType:'Lead' },
    { user: affs[0]._id, type:'ticket_created',  description:`Ticket: ${tickets[0].subject}`,      entityId: tickets[0]._id, entityType:'Ticket' },
    { user: affs[1]._id, type:'ticket_created',  description:`Ticket: ${tickets[1].subject}`,      entityId: tickets[1]._id, entityType:'Ticket' },
  ]);
  console.log('✅ Activities seeded');

  console.log('\n🎉 Seeding complete!\n');
  console.log('Admin     → admin@affiliatecrm.com  / admin123');
  console.log('Affiliate → sarah@affiliatecrm.com  / affiliate123\n');
  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
