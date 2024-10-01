    const mongoose = require('mongoose');
    const Joi = require('joi');
    const mongooseDelete = require('mongoose-delete');

    const userSchema = new mongoose.Schema({
        profileImage: { type: String,required: true}, 
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: { type: String, default: 'admin' },
    })


    const otpSchema = new mongoose.Schema({
        email: { type: String, required: true },
        otp: { type: String, required: true },
        expiresAt: { type: Date, required: true }
      });
      userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
      module.exports ={ 
        OtpModel : mongoose.model('Otp', otpSchema),
        User : mongoose.model('User', userSchema)
      }