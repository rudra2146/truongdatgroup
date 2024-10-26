const projectModel = require('./project.model');

exports.add = async (reqBody) => {
    return await projectModel(reqBody).save();
};

exports.get = async (id) => {
    return await projectModel.findOne({ _id: id }).lean();
};

exports.list = async (query) => {
    return await projectModel.find(query).lean();
};

exports.update = async (id, reqBody) => {
    return await projectModel.findByIdAndUpdate(id, { $set: reqBody }, { new: true }).lean();
};

exports.findOne = async (query) => {
    return await projectModel.findOne(query);
};

exports.delete = async (id) => {
    return await projectModel.findByIdAndDelete(id).lean();
};
