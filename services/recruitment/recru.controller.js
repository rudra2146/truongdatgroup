const Services = require("./recru.services");
const recruModel = require('./recru.model');
const mongoose = require('mongoose');
const commonResponse = require('../../helper/commonResponse');

const processImageFiles = (req, fieldName) => {
    return req.files[fieldName]
        ? req.files[fieldName].map(file => file.filename)
        : [];
};

const processVisionContent = (visionContent, visionImgFiles, existingVisionContent) => {
    return visionContent.map((content, index) => ({
        image: visionImgFiles[index] 
            ? `/uploads/${visionImgFiles[index]}` 
            : existingVisionContent[index]?.image,
        title: content.title || existingVisionContent[index]?.title,
        desc: content.desc || existingVisionContent[index]?.desc,
    }));
};

module.exports = {
    createUpdateRecru: async (req, res) => {
        try {
            const careerImgFiles = processImageFiles(req, 'careerImg');
            const visionImgFiles = processImageFiles(req, 'vision[image]');

            const { languageCode, bannerTitle, careerTitle, btnTitle, careerDesc, visionTitle, visionDesc, visionContent } = req.body;

            if (languageCode !== 'en' && languageCode !== 'vn') {
                return commonResponse.error(res, "Invalid language code", 400, "INVALID_LANGUAGE_CODE");
            }

            const existingRecruitment = await Services.findByLanguageCode(languageCode);

            if (existingRecruitment) {
                // Update logic
                existingRecruitment.banner.title = bannerTitle || existingRecruitment.banner.title;
                existingRecruitment.carrer = {
                    title: careerTitle || existingRecruitment.carrer.title,
                    btnTitle: btnTitle || existingRecruitment.carrer.btnTitle,
                    desc: careerDesc || existingRecruitment.carrer.desc,
                    careerImg: careerImgFiles.length ? `/uploads/${careerImgFiles[0]}` : existingRecruitment.carrer.careerImg,
                };
                existingRecruitment.vision = {
                    visionTitle: visionTitle || existingRecruitment.vision.visionTitle,
                    visionDesc: visionDesc || existingRecruitment.vision.visionDesc,
                    visionContent: processVisionContent(visionContent, visionImgFiles, existingRecruitment.vision.visionContent),
                };

                const updatedRecruitment = await existingRecruitment.save();
                return commonResponse.success(res, "Recruitment section updated successfully", 200, updatedRecruitment);

            } else {
                // Create logic
                const newRecruitment = new recruModel({
                    languageCode,
                    banner: { title: bannerTitle },
                    carrer: {
                        title: careerTitle,
                        btnTitle: btnTitle,
                        desc: careerDesc,
                        careerImg: careerImgFiles.length ? `/uploads/${careerImgFiles[0]}` : null,
                    },
                    vision: {
                        visionTitle: visionTitle,
                        visionDesc: visionDesc,
                        visionContent: processVisionContent(visionContent, visionImgFiles, []),
                    },
                });

                const savedRecruitment = await newRecruitment.save();
                return commonResponse.success(res, "Recruitment section created successfully", 201, savedRecruitment);
            }
        } catch (error) {
            console.error("Error saving recruitment:", error);
            return commonResponse.error(res, "An error occurred while saving recruitment data", 500, "ERROR_SAVING_RECRUITMENT");
        }
    },

    list: async (req, res, next) => {
        try {
            const languageCode = req.headers['languagecode'] === 'en' ? 'en' : 'vn';
            const userList = await Services.findByLanguageCode(languageCode);

            if (userList) {
                return commonResponse.success(res, "Users Retrieved Successfully", 200, userList, "Success");
            } else {
                return commonResponse.customResponse(res, "No Users Found", 404, {}, "No data available");
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
            return commonResponse.error(res, "Internal Server Error", 500, error);
        }
    },
};