const Services = require("./fields.services");
const fieldsModel = require('./fields.model');
const mongoose = require('mongoose');
const commonResponse = require('../../helper/commonResponse');
module.exports = {
        
    
    createUpdateFields: async (req, res) => {
        try {
            // Check if image files were uploaded for construction materials, work, and capacity
            const constructionImgFiles = req.files['constructionMatImage'] 
        ? req.files['constructionMatImage'].map(file => file.filename) 
        : [];
    
            const workImgFiles = req.files['work[image]'] 
                ? req.files['work[image]'].map(file => file.filename) 
                : [];

                const videoFile = req.files['video']
            ? req.files['video'][0].filename // Assuming only one video file
            : null;
    
            // Destructure body data
            const {
                languageCode, bannerTitle, constructionMatTitle, constructionMatDesc,
                capacityTitle, capacityDesc
            } = req.body;
    
            // Ensure the languageCode is either 'en' or 'vn'
            if (languageCode !== 'en' && languageCode !== 'vn') {
                return commonResponse.error(res, "Invalid language code", 400, "INVALID_LANGUAGE_CODE");
            }
    
            // Check if the about data already exists based on languageCode
    // Fix this line
            const existingAbout = await Services.findByLanguageCode(languageCode); // Pass languageCode as string

            // Create or Update logic
            if (existingAbout) {
                // Update banner section
                existingAbout.banner = {
                    title: bannerTitle || existingAbout.banner.title
                };
                // Extract titles and descriptions
const constructionWorkTitles = req.body.constructionMat.ConstructionWork.map(work => work.title) || [];
const constructionWorkDescs = req.body.constructionMat.ConstructionWork.map(work => work.desc) || [];

// Handle files for images
const constructionImgFiles = req.files['constructionMat[image]']
    ? req.files['constructionMat[image]'].map(file => file.filename)
    : [];

// Create ConstructionWork array with image, title, and description
const constructionWork = constructionImgFiles.map((file, index) => ({
    image: `/uploads/${file}`,  // Uploaded image path
    title: constructionWorkTitles[index] || '',  // Map corresponding title or fallback to empty string
    desc: constructionWorkDescs[index] || '',    // Map corresponding description or fallback to empty string
}));

// Build the final ConstructionMatirial object
existingAbout.constructionMat = {
    title: req.body.constructionMatTitle || existingAbout.constructionMat.title,
    desc: req.body.constructionMatDesc || existingAbout.constructionMat.desc,
    ConstructionWork: constructionWork,  // Array of objects with image, title, and desc
};
                // Check if work section exists in the request body
const workSection = req.body.work || {}; // Fallback to an empty object if undefined

            // Access titles and descriptions safely
            const workTitles = workSection.title || []; // Fallback to an empty array if undefined
            const workDescs = workSection.desc || []; // Fallback to an empty array if undefined
            const workImages = req.files['workImage'] || []; // Fallback to an empty array if undefined

            // Debugging output
            console.log("Request Body: ", req.body);
            console.log("Work Section: ", workSection);
            console.log("Work Titles: ", workTitles);
            console.log("Work Descriptions: ", workDescs);
            console.log("Work Images: ", workImages);

            // Update work section
            if (Array.isArray(workImages)) {
                existingAbout.work = {
                    work: workImages.map((file, index) => ({
                        image: `/uploads/${file.filename}`, 
                        title: workTitles[index] || '', 
                        desc: workDescs[index] || '', 
                    })).filter(workItem => workItem.title || workItem.desc || workItem.image),
                };
            } else {
                console.error("Work images is not an array:", workImages);
            }


                // Save updated about data
                const updatedAbout = await existingAbout.save();
                // console.log("About data updated:", updatedAbout);
    
                return commonResponse.success(res, "About section updated successfully", 200, updatedAbout);
    
            } else {
                // Create new about data
    
                // Construct the banner section
                const bannerSection = {
                    title: bannerTitle,
                };
    
                // Construct the construction material section
                const constructionMatSection = {
                    title: constructionMatTitle,
                    desc: constructionMatDesc,
                    ConstructionWork: constructionImgFiles.map((file, index) => ({
                        image: `/uploads/${file}`,
                        title: req.body['constructionMat[ConstructionWork][title]']?.[index] || "",
                        desc: req.body['constructionMat[ConstructionWork][desc]']?.[index] || "",
                    })),
                };
    
                // Construct the work section
                const workSection = {
                    work: workImgFiles.map((file, index) => ({
                        image: `/uploads/${file}`,
                        title: req.body['work[title]']?.[index] || "",
                        desc: req.body['work[desc]']?.[index] || "",
                    })),
                };
    
                // Construct the capacity section
                const capacitySection = {
                    title: capacityTitle,
                    desc: capacityDesc,
                    video: videoFile ? `/uploads/${videoFile}` : null 
                };
    
                // Create new about data
                const newAbout = new fieldsModel({
                    languageCode,
                    banner: bannerSection,
                    constructionMat: constructionMatSection,
                    work: workSection,
                    capacity: capacitySection,
                });
    
                // Save new about data
                const savedAbout = await newAbout.save();
                console.log("New about data saved:", savedAbout);
    
                return commonResponse.success(res, "About section created successfully", 201, savedAbout);
            }
        } catch (error) {
            console.error("Error saving about:", error);
            return commonResponse.error(res, "An error occurred while saving about data", 500, "ERROR_SAVING_ABOUT");
        }
    },


    
    
       
    
    
    
    /**
     * List
     */
    listFields: async (req, res, next) => {
        try {
            console.log("Request Headers: ", req.headers);
            const languageCode = req.headers['languagecode'] || 'vn'; // 'vn' is the default
            console.log("Selected languageCode: ", languageCode);
    
            // Pass languageCode as a string, not an object
            const userList = await Services.findByLanguageCode(languageCode);
    
            // Check if there is data for the specified language
            if (userList) {
                commonResponse.success(res, "Users Retrieved Successfully", 200, userList, "Success");
            } else {
                commonResponse.customResponse(res, "No Users Found", 404, {}, "No data available");
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
            commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    }
};
