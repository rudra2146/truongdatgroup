const homeModel = require('./home.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await homeModel(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(id) {
    return await homeModel.findById(id);}

/**
 * List
 */
exports.list = async function(query) {
    return await homeModel.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await homeModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await homeModel.findByIdAndDelete({ _id: id }).lean();
} ,

exports.getByLanguageCode = async function(languageCode) {
    // Use `findOne` to return a single object for the given language code
    return await homeModel.findOne({ languageCode: languageCode, deletedAt: null });
}