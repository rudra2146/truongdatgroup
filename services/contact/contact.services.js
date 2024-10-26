// contact.services.js

const contactModel = require('./contact.model');

exports.add = async function(reqBody) {
    return await contactModel(reqBody).save();
}

exports.get = async function(id) {
    return await contactModel.findById(id).lean();
}

exports.list = async function(query) {
    return await contactModel.find(query).lean();
}

exports.update = async function(id, reqBody) {
    return await contactModel.findByIdAndUpdate(id, { $set: reqBody }, { new: true }).lean();
}

exports.delete = async function(id) {
    return await contactModel.findByIdAndDelete(id).lean();
}

exports.findByLanguageCode = async (languageCode) => {
    return await contactModel.findOne({ languageCode }).lean();
};