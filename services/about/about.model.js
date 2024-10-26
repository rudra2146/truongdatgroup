const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Define the banner schema
const bannerSchema = new mongoose.Schema({
    title: String,
});

// Define the history schema
const historySchema = new mongoose.Schema({
    title: String,
    desc: String,
    history: [
        {
            year: String,
            desc: String,
        },
    ],
});

// Define the vision & mission schema
const visionMissionSchema = new mongoose.Schema({
    vision: {
        image: String,
        title: String,
        desc: String,
    },
    mission: {
        image: String,
        title: String,
        desc: String,
    },
});

// Define the board of management schema
const boardOfManagementSchema = new mongoose.Schema({
    name: String,
    design: String,
    image: String,
});

// Define the quality, value, trust schema
const qualityValueTrustSchema = new mongoose.Schema({
    title: String,
    quality: {
        image: String,
        title: String,
        desc: String,
    },
    value: {
        image: String,
        title: String,
        desc: String,
    },
    trust: {
        image: String,
        title: String,
        desc: String,
    },
});
const contactDataSchema = new mongoose.Schema({
  en: {
    title: String,
    animatedText: String,
    company: String,
    mobile: String,
    email: String,
    address: String,
    btn: String,
  },
  vn: {
    title: String,
    animatedText: String,
    company: String,
    mobile: String,
    email: String,
    address: String,
    btn: String,
  }
});

// Main about schema
const aboutSchema = new mongoose.Schema({
    languageCode: {
        type: String,
        enum: ['en', 'vn'],
        required: true,
    },
    banner: bannerSchema,
    history: historySchema,
    visionMission: visionMissionSchema,
    boardOfManagement: [boardOfManagementSchema],
    qualityValueTrust: qualityValueTrustSchema,
    homeContactData: contactDataSchema,
    deletedAt: { type: Date, default: null }, // Soft delete field
});


// Applying the mongoose-delete plugin for soft deletes
aboutSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// Export the model
module.exports = mongoose.model('About', aboutSchema);
