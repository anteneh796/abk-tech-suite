require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./src/models/Service');
const Project = require('./src/models/Project');
const News = require('./src/models/News');
const Partner = require('./src/models/Partner');
const TimelineItem = require('./src/models/TimelineItem');
const User = require('./src/models/User');

const adminUser = {
  name: "ABK Admin",
  email: "admin@abk.com",
  password: "adminpassword123", 
  role: "admin"
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Cleaning up old admin accounts...');
    await User.deleteMany({ email: { $in: ['admin@abk.com', 'admin@abktech.com'] } });

    console.log('Creating fresh admin user...');
    const newAdmin = new User({
        name: "ABK Admin",
        email: "admin@abk.com",
        password: "adminpassword123", 
        role: "admin"
    });
    await newAdmin.save();

    // Re-seed partners with reliable images if count is low
    const partnerCount = await Partner.countDocuments();
    if (partnerCount < 2) {
        console.log('Re-seeding partners with reliable images...');
        await Partner.deleteMany({});
        await Partner.insertMany([
            {
                name: "University of Gondar",
                logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=400",
                website: "https://uog.edu.et",
                order: 1
            },
            {
                name: "Ministry of Innovation",
                logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400",
                website: "https://mint.gov.et",
                order: 2
            }
        ]);
    }
    
    console.log('Admin user ready: admin@abk.com / adminpassword123');
    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
