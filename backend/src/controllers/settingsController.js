const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    
    // Fallback defaults (matching client's specific branding)
    const defaults = {
      site_name: "ABK Technology",
      site_tagline: "ENGINEERING SUSTAINABLE SOLUTIONS",
      hero_title: "ABK Technology – Engineering Excellence",
      hero_description: "Comprehensive, innovative, and customer-focused engineering solutions across healthcare, energy, and industrial sectors.",
      hero_badge: "Engineering Excellence Since 2018",
      hero_button_text: "Explore Services",
      contact_phone: "+251 913721058",
      contact_email: "anteneh.belay06@yahoo.com",
      contact_address: "Gondar, Ethiopia",
      footer_description: "Engineering Sustainable Solutions for Ethiopia's Future.",
      login_quote_text: "ABK Technologies transformed our hospital's equipment maintenance. Their response time and expertise are unmatched.",
      login_quote_author: "Dr. Alemayehu Bekele",
      login_quote_role: "Director, University of Gondar Hospital",
      social_linkedin: "https://linkedin.com",
      social_facebook: "https://facebook.com",
      social_telegram: "https://t.me/abktech"
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
