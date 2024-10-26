const fieldsModel = require('./fields.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await fieldsModel(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(id) {
    return await fieldsModel.findOne({ _id: id }).sort({ created_at: -1 }).lean();
}

/**
 * List
 */
exports.list = async function(query) {
    return await fieldsModel.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await fieldsModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await fieldsModel.findByIdAndDelete({ _id: id }).lean();
} 

exports.findByLanguageCode = async (languageCode) => {
    return await fieldsModel.find({ languageCode: languageCode }); // This ensures languageCode is queried as a string
};

exports.findByLanguageCode = async (languageCode) => {
    return await fieldsModel.findOne({ languageCode }); // Expecting a string
};


