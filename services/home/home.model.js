const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Header section schema
const headerSectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  buttonTitle: String,
});

// About section schema for both English and Vietnamese
const aboutSectionSchema = new mongoose.Schema({
  yearImg: String,
  img: String,
  en: {  // Ensure that 'en' key is present in schema
    aboutTitle: String,
    aboutDescription: String,
    animatedText: String,
    yearOfWork: String,
  },
  vn: {
    aboutTitle: String,
    aboutDescription: String,
    animatedText: String,
    yearOfWork: String,
  }
});

// Carousel schema for English and Vietnamese
// const carouselSchema = new mongoose.Schema({
//   items: [{
//     title: String,
//     img:   
//   }]
// });

const companyDetailSchema = new mongoose.Schema({
  en: [{
      year: { type: String, required: false },
      yearDesc: { type: String, required: false },
      project: { type: String, required: false },
      projectDesc: { type: String, required: false },
      customer: { type: String, required: false },
      customerDesc: { type: String, required: false }
  }],
  
  vn: [{
      year: { type: String, required: false },
      yearDesc: { type: String, required: false },
      project: { type: String, required: false },
      projectDesc: { type: String, required: false },
      customer: { type: String, required: false },
      customerDesc: { type: String, required: false }
  }]
});

 
// Contact data schema
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

// Main home schema
const homeSchema = new mongoose.Schema({
  languageCode: { 
    type: String,  
    enum: ['en', 'vn'], 
    required: true 
  },
  headerSection: headerSectionSchema,
  homeAboutSection: aboutSectionSchema,
homeCarouselSection: [{ 
    title: String,
    img: String
}],
  homeCompanyDetailSection: companyDetailSchema,
  homeContactData: contactDataSchema,
  deletedAt: { type: Date, default: null } // Soft delete field
});

// Applying the mongoose-delete plugin for soft deletes
homeSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// Exporting the model
module.exports = mongoose.model('Home', homeSchema);