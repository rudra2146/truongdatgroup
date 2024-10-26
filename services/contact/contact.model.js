const mongoose = require('mongoose');

// Mongoose schema
const contactSchema = new mongoose.Schema({
    languageCode: { type: String, required: true },
    bannerTitle: { type: String, required: true },
    contactMainTitle: { type: String, required: true },
    contactTitle: { type: String, required: true },
    headOfficeAddress: { type: String, required: true },
    representiveOfficeAddress: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

// Mongoose model
const contactModel = mongoose.model('Contact', contactSchema);

// Export the model
module.exports = contactModel;
