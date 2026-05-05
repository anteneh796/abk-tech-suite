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

    // Only seed if empty
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        console.log('Database already has data. Skipping seed to prevent overwriting production data.');
        process.exit();
    }

    console.log('Seeding initial data...');
    await User.create(adminUser);
    
    // Add some default services/partners if needed
    // (Omitted for brevity, but could add from previous seed file)

    console.log('Admin user created: admin@abktech.com / adminpassword123');
    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
