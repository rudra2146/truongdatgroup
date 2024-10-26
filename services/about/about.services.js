const aboutModel = require('./about.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await aboutModel(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(id) {
    return await aboutModel.findOne({ _id: id }).sort({ created_at: -1 }).lean();
}

/**
 * List
 */
exports.list = async function(query) {
    return await aboutModel.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await aboutModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await aboutModel.findByIdAndDelete({ _id: id }).lean();
} 

exports.findByLanguageCode = async (languageCode) => {
    return await aboutModel.findOne({ languageCode, deletedAt: null });
};