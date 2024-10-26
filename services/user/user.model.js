    const mongoose = require('mongoose');
    const mongooseDelete = require('mongoose-delete');

    const userSchema = new mongoose.Schema({
        profileImage: { type: String}, 
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
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