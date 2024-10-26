const Services = require("./about.services");
const aboutModel = require('./about.model');
const mongoose = require('mongoose');
const commonResponse = require('../../helper/commonResponse');
module.exports = {
    createUpdateAbout: async (req, res) => {
        try {
            // Check if yearImg and img were uploaded
            const visionImgFile = req.files['visionMission[vision][image]'] ? req.files['visionMission[vision][image]'][0].filename : null;
            const missionImgFile = req.files['visionMission[mission][image]'] ? req.files['visionMission[mission][image]'][0].filename : null;
    
            const directorsImgFiles = req.files['directorsImg[image]'] 
            ? req.files['directorsImg[image]'].map(file => file.filename) 
            : [];
    
            // Check if quality, value, and trust images were uploaded
            const qualityImgFile = req.files['quality[en][image]'] ? req.files['quality[en][image]'][0].filename : null;

            const valueImgFile = req.files['value[en][image]'] ? req.files['value[en][image]'][0].filename : null;
            const trustImgFile = req.files['trust[en][image]'] ? req.files['trust[en][image]'][0].filename : null;
    
            // Destructure body data
            const {
                languageCode, bannerTitle, historyTitle, historyDesc,
                historyYear, historyDescription, visionTitle, visionDesc,
                missionTitle, missionDesc, directorsName, directorsDesign,
                qualityValTrustTitle, qualityTitle, qualityDesc, valueTitle, valueDesc,
                trustTitle, trustDesc, contactTitle, contactAnimatedText, contactCompany, contactMobile,
                contactEmail, contactAddress, contactBtn
            } = req.body;
    
            // Ensure the languageCode is either 'en' or 'vn'
            if (languageCode !== 'en' && languageCode !== 'vn') {
                return commonResponse.error(res, "Invalid language code", 400, "INVALID_LANGUAGE_CODE");
            }
    
            // Ensure arrays are defined
            const historyYears = Array.isArray(historyYear) ? historyYear : [];
            const historyDescriptions = Array.isArray(historyDescription) ? historyDescription : [];
            const directorsNames = Array.isArray(directorsName) ? directorsName : [];
            const directorsDesigns = Array.isArray(directorsDesign) ? directorsDesign : [];
    
            // Check if the home data already exists based on languageCode
            const existingHome = await Services.findByLanguageCode(languageCode);
    
            // Create or Update logic
            if (existingHome) {
                // Update header section
                existingHome.banner = {
                    title: bannerTitle || existingHome.banner.title
                };
    
                // Update history section
                existingHome.history = {
                    title: historyTitle || existingHome.history.title,
                    desc: historyDesc || existingHome.history.desc,
                    history: historyYears.map((year, index) => ({
                        year,
                        desc: historyDescriptions[index] || ""
                    })),
                };
    
                // Update vision & mission section
                existingHome.visionMission = {
                    vision: {
                        image: visionImgFile ? `/uploads/${visionImgFile}` : existingHome.visionMission.vision.image,
                        title: visionTitle || existingHome.visionMission.vision.title,
                        desc: visionDesc || existingHome.visionMission.vision.desc,
                    },
                    mission: {
                        image: missionImgFile ? `/uploads/${missionImgFile}` : existingHome.visionMission.mission.image,
                        title: missionTitle || existingHome.visionMission.mission.title,
                        desc: missionDesc || existingHome.visionMission.mission.desc,
                    },
                };
                const directorsNames = Array.isArray(req.body.directorsName) ? req.body.directorsName : [req.body.directorsName].filter(Boolean);
                const directorsDesigns = Array.isArray(req.body.directorsDesign) ? req.body.directorsDesign : [req.body.directorsDesign].filter(Boolean);
                

                console.log('directorsNames:', directorsNames);  // Check the directors' names
                console.log('directorsDesigns:', directorsDesigns);  // Check the directors' designations
                console.log('directorsImgFiles:', directorsImgFiles);
                existingHome.boardOfManagement = directorsImgFiles.map((file, index) => {
                    return {
                        name: directorsNames[index] || existingHome.boardOfManagement[index]?.name || "",
                        design: directorsDesigns[index] || existingHome.boardOfManagement[index]?.design || "",
                        image: `/uploads/${file}`
                    };
                });
                

                // Update quality, value, trust section
                existingHome.qualityValueTrust = {
                    title: qualityValTrustTitle || existingHome.qualityValueTrust.title,
                    quality: {
                        image: qualityImgFile ? `/uploads/${qualityImgFile}` : existingHome.qualityValueTrust.quality.image,
                        title: qualityTitle || existingHome.qualityValueTrust.quality.title,
                        desc: qualityDesc || existingHome.qualityValueTrust.quality.desc,
                    },
                    value: {
                        image: valueImgFile ? `/uploads/${valueImgFile}` : existingHome.qualityValueTrust.value.image,
                        title: valueTitle || existingHome.qualityValueTrust.value.title,
                        desc: valueDesc || existingHome.qualityValueTrust.value.desc,
                    },
                    trust: {
                        image: trustImgFile ? `/uploads/${trustImgFile}` : existingHome.qualityValueTrust.trust.image,
                        title: trustTitle || existingHome.qualityValueTrust.trust.title,
                        desc: trustDesc || existingHome.qualityValueTrust.trust.desc,
                    },
                };
    
                // Update contact section
                existingHome.homeContactData[languageCode] = {
                    title: contactTitle || existingHome.homeContactData[languageCode].title,
                    animatedText: contactAnimatedText || existingHome.homeContactData[languageCode].animatedText,
                    company: contactCompany || existingHome.homeContactData[languageCode].company,
                    mobile: contactMobile || existingHome.homeContactData[languageCode].mobile,
                    email: contactEmail || existingHome.homeContactData[languageCode].email,
                    address: contactAddress || existingHome.homeContactData[languageCode].address,
                    btn: contactBtn || existingHome.homeContactData[languageCode].btn
                };
    
                // Save updated home data
                const updatedHome = await existingHome.save();
                console.log("Home data updated:", updatedHome);
    
                return commonResponse.success(res, "About page List loaded successfully", 200, updatedHome);
    
            } else {
                // Create new home data
    
                // Construct the header section
                const headerSection = {
                    title: bannerTitle,
                    description: "",
                    buttonTitle: ""
                };
    
                // Construct the history section
                const historySection = {
                    title: historyTitle,
                    desc: historyDesc,
                    history: historyYears.map((year, index) => ({
                        year,
                        desc: historyDescriptions[index] || ""
                    })),
                };
    
                // Construct the vision & mission section
                const visionMissionSection = {
                    vision: {
                        image: `/uploads/${visionImgFile}`,
                        title: visionTitle,
                        desc: visionDesc,
                    },
                    mission: {
                        image: `/uploads/${missionImgFile}`,
                        title: missionTitle,
                        desc: missionDesc,
                    },
                };
    
                // Process board of management section
                const boardOfManagementSection = directorsImgFiles.map((file, index) => ({
                    name: directorsNames[index] || "",
                    designEN: directorsDesigns[index] || "",
                    image: `/uploads/${file.filename}`
                }));
    
                // Quality, value, trust section
                const qualityValueTrustSection = {
                    title: qualityValTrustTitle,
                    quality: {
                        image: `/uploads/${qualityImgFile}`,  // Handle quality image upload
                        title: qualityTitle,
                        desc: qualityDesc,
                    },
                    value: {
                        image: `/uploads/${valueImgFile}`,  // Handle value image upload
                        title: valueTitle,
                        desc: valueDesc,
                    },
                    trust: {
                        image: `/uploads/${trustImgFile}`,  // Handle trust image upload
                        title: trustTitle,
                        desc: trustDesc,
                    },
                };
    
                // Construct the contact section
                const contactSection = {
                    title: contactTitle,
                    animatedText: contactAnimatedText,
                    company: contactCompany,
                    mobile: contactMobile,
                    email: contactEmail,
                    address: contactAddress,
                    btn: contactBtn
                };
    
                // Create new home data
                const newHome = new aboutModel({
                    languageCode,
                    banner: headerSection,
                    history: historySection,
                    visionMission: visionMissionSection,
                    boardOfManagement: boardOfManagementSection,
                    qualityValueTrust: qualityValueTrustSection,
                    homeContactData: {
                        [languageCode]: contactSection,
                    },
                });
    
                // Save new home data
                const savedHome = await newHome.save();
                console.log("New home data saved:", savedHome);
    
                return commonResponse.success(res, "About page List loaded successfully", 201, savedHome);
            }
        } catch (error) {
            console.error("Error saving home:", error);
            return commonResponse.error(res, "An error occurred while saving home data", 500, "ERROR_SAVING_HOME");
        }
    },    
    
       
    
    
    
    /**
     * List
     */
    listAbout: async (req, res, next) => { 
        try {
            // Log the request headers to ensure the languageCode is being sent correctly
            console.log("Request Headers: ", req.headers);
    
            // Get the languageCode from the request headers, default to 'vn' if not provided
            const languageCode = (req.headers['languagecode'] || 'vn').toLowerCase();  // Ensure lowercase
    
            // Log the selected language code for debugging
            console.log("Selected languageCode: ", languageCode);
    
            // Fetch the data based on the languageCode
            let listAll = await Services.findByLanguageCode(languageCode);
    
            // Check if data was found
            if (listAll) { // Change from listAll.length to just listAll
                commonResponse.success(res, "Homes Retrieved Successfully", 200, listAll, "Success");
            } else {
                commonResponse.customResponse(res, "No Homes Found", 404, {}, "No data available");
            }
        } catch (error) {
            // Handle any errors that occur
            commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },
    
    
    
    /**
     * Get
     */

    getAbout: async (req, res, next) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return commonResponse.error(res, "Invalid ID format", 400, "Invalid ID format");
            }
            const home = await Home.findById(req.params.id);
            if (!home) return res.status(404).json({ message: "Home Section Not Found" });
            commonResponse.success(res, "Home Retrieved Successfully", 200, home, "Success");
        } catch (error) {
            commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },  

    /*
     * delete
     */
    
    deleteHome: async (req, res, next) => {
        try {
            // Check if the provided ID is valid
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return commonResponse.error(res, "Invalid ID format", 400, "Invalid ID format");
            }
    
            // Find the document by ID
            const home = await Home.findById(req.params.id);
            if (!home) return res.status(404).json({ message: "Home Section Not Found" });
    
            // Perform soft-delete
            await home.delete(); // Soft-delete the document, setting the deletedAt field automatically
    
            // Return the soft-deleted document with the deletedAt field included
            res.json({
                message: "Home Section Soft Deleted",
                data: home,  // Sending the home data back in the response
            });
        } catch (error) {
            next(error);
        }
    }
    
    
};
