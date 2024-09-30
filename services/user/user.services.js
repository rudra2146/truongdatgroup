const {User} = require('./user.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await User(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(email) {
    return await User.findOne({ email }).lean();
}

/**
 * List
 */
exports.list = async function(query) {
    return await User.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await User.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await User.findByIdAndDelete({ _id: id }).lean();
}