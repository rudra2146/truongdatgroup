const ProductsModel = require('./products.model.js');

/**
 * add
 */
exports.add = async function(reqBody) {
    return await ProductsModel(reqBody).save();
}

/**
 * Get
 */
exports.get = async function(id) {
    return await ProductsModel.findOne({ _id: id }).sort({ created_at: -1 }).lean();
}

/**
 * List
 */
exports.list = async function(query) {
    return await ProductsModel.find(query).lean();
}

/**
 * update
 */
exports.update = async function(id, reqBody) {
    return await ProductsModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
}

/**
 * Delete
 */
exports.delete = async function(id) {
    return await ProductsModel.findByIdAndDelete({ _id: id }).lean();
}