const Services = require("./home.services");
const commonResponse = require('../../helper/commonResponse');
const mongoose = require('mongoose');

module.exports = {
    /**
     * Create Home (with file upload)
     */
    createHome: async (req, res) => {
        try {
            if (!req.file) {
                return commonResponse.error(res, "Error: carouselImg is required", 400, "CAROUSEL_IMG_REQUIRED");
            }

            const homeData = {
                languageCode: req.body.languageCode,
                homeCarouselSection: [
                    { 
                        carouselTitle: req.body.carouselTitle, 
                        carouselImg: `/upload/${req.file.filename}` 
                    }
                ],
                homeContact: { 
                    title: req.body.title,
                    animatedText: req.body.animatedText,
                    company: req.body.company,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    address: req.body.address,
                    btn: req.body.btn,
                },
            };

            const savedHome = await Services.add(homeData);

            if (!savedHome) {
                return commonResponse.error(res, "Data not saved", 500, "DATA_NOT_SAVED");
            }

            return commonResponse.success(res, "Home Created Successfully", 201, savedHome, "Success");
        } catch (error) {
            console.error("Error saving Home:", error);
            return commonResponse.error(res, "Error saving Home", 500, error.message);
        }
    },

    /**
     * List
     */
    listHome: async (req, res) => {
        try {
            const languageCode = req.headers['languagecode'] || 'vn';
            let query = { deletedAt: null, languageCode: languageCode };
            let listAll = await Services.list(query);

            if (listAll.length > 0) {
                return commonResponse.success(res, "Homes Retrieved Successfully", 200, listAll, "Success");
            } else {
                return commonResponse.customResponse(res, "No Homes Found", 404, {}, "No data available");
            }
        } catch (error) {
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    /**
     * Get
     */
    getHome: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return commonResponse.error(res, "Invalid ID format", 400, "Invalid ID format");
            }
            const home = await Services.get(req.params.id);
            if (!home) {
                return commonResponse.error(res, "Home Section Not Found", 404);
            }
            return commonResponse.success(res, "Home Retrieved Successfully", 200, home, "Success");
        } catch (error) {
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    /**
     * Update
     */
    updateHome: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return commonResponse.error(res, "Invalid ID format", 400, "Invalid ID format");
            }
    
            const home = await Services.get(req.params.id);
            if (!home) {
                return commonResponse.error(res, "Home Section Not Found", 404);
            }
            
            // Update fields based on provided data
            if (req.body.languageCode) {
                home.languageCode = req.body.languageCode;
            }
            if (req.body.homeContact) {
                Object.assign(home.homeContact, req.body.homeContact);
            }
            if (req.body.homeCarouselSection) {
                req.body.homeCarouselSection.forEach((carouselItem) => {
                    const existingItem = home.homeCarouselSection.find(item => item._id.toString() === carouselItem._id);
                    if (existingItem) {
                        Object.assign(existingItem, carouselItem);
                        if (req.file) {
                            existingItem.carouselImg = `/upload/${req.file.filename}`;
                        }
                    }
                });
            }
    
            const updatedHome = await home.save(); // This should now work
            return commonResponse.success(res, "Home Section Updated", 200, updatedHome, "Success");
        } catch (error) {
            console.error(error);
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    /**
     * Delete
     */
    deleteHome: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return commonResponse.error(res, "Invalid ID format", 400, "Invalid ID format");
            }

            const home = await Services.get(req.params.id);
            if (!home) return commonResponse.error(res, "Home Section Not Found", 404);

            await home.delete(); // Perform soft delete
            return commonResponse.success(res, "Home Section Soft Deleted", 200, home, "Success");
        } catch (error) {
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    }
};