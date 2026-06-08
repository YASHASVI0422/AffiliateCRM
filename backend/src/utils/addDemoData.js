const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Lead = require('../models/Lead');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  // Admin
  let admin = await User.findOne({ email: 'admin@affiliatecrm.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Alex Johnson',
      email: 'admin@affiliatecrm.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-000-0001'
    });
    console.log('✅ Admin created');
  }

  // Affiliates
  const affiliateData = [
    { name: 'Sarah Williams', email: 'sarah@affiliatecrm.com', password: 'affiliate123', role: 'affiliate' },
    { name: 'Marcus Chen', email: 'marcus@affiliatecrm.com', password: 'affiliate123', role: 'affiliate' },
    { name: 'Priya Sharma', email: 'priya@affiliatecrm.com', password: 'affiliate123', role: 'affiliate' }
  ];

  const affiliates = [];
  for (const affiliate of affiliateData) {
    let user = await User.findOne({ email: affiliate.email });
    if (!user) {
      user = await User.create(affiliate);
      console.log(`✅ Created ${affiliate.email}`);
    }
    affiliates.push(user);
  }

  // Leads
  const leadData = [
    { name: 'Jordan Blake', email: 'jordan@ex.com', company: 'TechVentures', status: 'Converted', source: 'Referral', value: 1200 },
    { name: 'Emma Davis', email: 'emma@ex.com', company: 'StartupCo', status: 'Interested', source: 'Website', value: 800 },
    { name: 'Liam Torres', email: 'liam@ex.com', company: 'GrowthHub', status: 'Joined Community', source: 'Social Media', value: 950 },
    { name: 'Olivia Park', email: 'olivia@ex.com', company: 'NexGen Ltd', status: 'Contacted', source: 'Email Campaign', value: 600 },
    { name: 'Noah Martinez', email: 'noah@ex.com', company: 'CloudScale', status: 'New Lead', source: 'Cold Call', value: 0 },
    { name: 'Ava Thompson', email: 'ava@ex.com', company: 'DataPeak', status: 'Converted', source: 'Event', value: 1500 }
  ];

  let created = 0;
  for (let i = 0; i < leadData.length; i++) {
    const lead = leadData[i];
    const exists = await Lead.findOne({ email: lead.email });
    if (!exists) {
      await Lead.create({
        ...lead,
        phone: `+1-555-20${i}-0001`,
        assignedAffiliate: affiliates[i % affiliates.length]._id,
        createdBy: admin._id,
        notes: 'Initial contact made.',
        convertedAt: lead.status === 'Converted' ? new Date() : undefined
      });
      created++;
    }
  }

  console.log(`✅ ${created} demo leads added`);
  console.log('\n🎉 Demo data added successfully!\n');
  console.log('Admin Login');
  console.log('admin@affiliatecrm.com / admin123');
  console.log('\nAffiliate Login');
  console.log('sarah@affiliatecrm.com / affiliate123');
};

run().catch(err => {
  console.error(err);
});
