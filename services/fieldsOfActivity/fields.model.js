const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Define the banner schema
const sectionTitleSchema = new mongoose.Schema({
    title: { type: String, required: true },
});

// Define the construction material schema
const constructionMatSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    ConstructionWork: [
        {
            image: { type: String, required: true },
            title: { type: String, required: true },
            desc: { type: String, required: true },
        },
    ],
});

// Define the work schema
const workSchema = new mongoose.Schema({
    work: [
        { 
            image: { type: String, required: true },
            title: { type: String, required: true },
            desc: { type: String, required: true },
        }
    ]
});

// Define the capacity schema
const capacitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    video: { type: String, required: false },
});

// Main about schema
const fieldsSchema = new mongoose.Schema({
    languageCode: { type: String, enum: ['en', 'vn'], required: true },
    banner: sectionTitleSchema,
    constructionMat: constructionMatSchema,
    work: workSchema,
    capacity: capacitySchema,
    deletedAt: { type: Date, default: null }, // Soft delete field
});

// Applying the mongoose-delete plugin for soft deletes
fieldsSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// Export the model
module.exports = mongoose.model('Fields', fieldsSchema);