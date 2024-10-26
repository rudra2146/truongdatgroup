const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Define the banner schema
const sectionTitleSchema = new mongoose.Schema({
    title: { type: String, required: true },
});

// Define the construction material schema
const carrerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    btnTitle : {type: String, required: true},
    desc: { type: String, required: true },
    careerImg : { type: String, required: true}
});

// Define the work schema
const visionSchema = new mongoose.Schema({
    visionTitle: { type: String, required: true },
    visionDesc: { type: String, required: true },
    visionContent: [
        { 
            image: { type: String, required: true },
            title: { type: String, required: true },
            desc: { type: String, required: true },
        }
    ]
});


// Main about schema
const recruSchema = new mongoose.Schema({
    languageCode: { type: String, enum: ['en', 'vn'], required: true },
    banner: sectionTitleSchema,
    carrer: carrerSchema,
    vision: visionSchema,
    deletedAt: { type: Date, default: null }, // Soft delete field
});

// Applying the mongoose-delete plugin for soft deletes
recruSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// Export the model
module.exports = mongoose.model('Recruitment', recruSchema);