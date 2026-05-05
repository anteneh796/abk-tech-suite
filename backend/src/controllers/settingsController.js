const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    
    // Fallback defaults
    const defaults = {
      hero_title: "Engineering Sustainable Solutions for Ethiopia",
      hero_description: "Leading the transition to renewable energy and industrial excellence with innovative engineering and maintenance services.",
      contact_phone: "+251 96 282 7360",
      contact_email: "abktechnology19@gmail.com",
      contact_address: "Gondar, Ethiopia",
      social_linkedin: "",
      social_facebook: "",
      social_instagram: "",
      social_telegram: "",
      social_youtube: ""
    };

    res.json({ ...defaults, ...settingsMap });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const promises = Object.keys(updates).map(key => {
      return Setting.findOneAndUpdate(
        { key },
        { key, value: updates[key] },
        { upsert: true, new: true }
      );
    });
    await Promise.all(promises);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
