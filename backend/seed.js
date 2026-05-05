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

    console.log('Ensuring admin user exists...');
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
        existingAdmin.password = adminUser.password;
        await existingAdmin.save();
    } else {
        const newAdmin = new User(adminUser);
        await newAdmin.save();
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
