const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const carouselSchema = new mongoose.Schema({
  carouselTitle: String,
  carouselImg: String,
});

const contactSchema = new mongoose.Schema({
  title: String,
  animatedText: String,
  company: String,
  mobile: String,
  email: String,
  address: String,
  btn: String,
});

const homeSchema = new mongoose.Schema({
  languageCode:{   type: String,  
  enum: ['en', 'vn'], 
  required: true},
  homeCarouselSection: [carouselSchema],
  homeContact: contactSchema,
  deletedAt: { type: Date, default: null } 
});
homeSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Home', homeSchema);