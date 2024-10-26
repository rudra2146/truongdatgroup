const recruModel = require('./recru.model.js');

/**
 * Add new recruitment
 */
exports.add = async (reqBody) => {
    return await recruModel(reqBody).save();
};

/**
 * Get recruitment by ID
 */
exports.get = async (id) => {
    return await recruModel.findOne({ _id: id }).sort({ created_at: -1 }).lean();
};

/**
 * List recruitments based on query
 */
exports.list = async (query) => {
    return await recruModel.find(query).lean();
};

/**
 * Update recruitment by ID
 */
exports.update = async (id, reqBody) => {
    return await recruModel.findByIdAndUpdate({ _id: id }, { $set: reqBody }, { new: true }).lean();
};

/**
 * Delete recruitment by ID (soft-delete)
 */
exports.delete = async (id) => {
    return await recruModel.findByIdAndDelete({ _id: id }).lean();
};

/**
 * Find recruitment by language code
 */
exports.findByLanguageCode = async (languageCode) => {
    return await recruModel.findOne({ languageCode }); // Return a Mongoose document (without .lean())
};
