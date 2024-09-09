const UsersModel = require('./users.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await UsersModel(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(id) {
    return await UsersModel.findOne({ _id: id }).sort({ created_at: -1 }).lean();
}

/**
 * List
 */
exports.list = async function(query) {
    return await UsersModel.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await UsersModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await UsersModel.findByIdAndDelete({ _id: id }).lean();
}
