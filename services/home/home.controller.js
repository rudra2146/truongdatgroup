const Home = require("./home.model");

const mongoose = require('mongoose');
const commonResponse = require('../../helper/commonResponse');

module.exports = {
    /**
     * Add
     */

    createHome: async (req, res, next) => {
        try {
            // Ensure image is uploaded
            if (!req.file) {
                return commonResponse.error(
                    res, 
                    "Error: carouselImg is required", // Updated error message for clarity
                    400, 
                    "CAROUSEL_IMG_REQUIRED" // Updated message code
                );
            }
    
            // Prepare home data object, including the image path
            const homeData = {
                languageCode: req.body.languageCode,
                homeCarouselSection: [
                    { 
                        carouselTitle: req.body.carouselTitle, 
                        carouselImg: `/upload/${req.file.filename}` // Multer saves filename
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
    
            // Create a new home entry
            const home = new Home(homeData);
            const savedHome = await home.save();
    
            // Send success response
            commonResponse.success(
                res, 
                "Home Created Successfully", 
                201, 
                savedHome, 
                "Success"
            );
        } catch (error) {
            next(error);
        }
    },
    
    
    /**
     * List
     */
    listHome: async (req, res, next) => {
        try {
            // Log the request headers to ensure the languageCode is being sent and received correctly
            console.log("Request Headers: ", req.headers);
    
            // Get the languageCode from the request headers, default to 'vn' if not provided
            const languageCode = req.headers['languagecode'] || 'vn';  // Ensure lowercase
    
            // Log the selected language code for debugging
            console.log("Selected languageCode: ", languageCode);
    
            // Create query to filter by languageCode and deletedAt
            let query = { deletedAt: null, languageCode: languageCode };
    
            // Fetch the data based on the query
            let listAll = await Home.find(query);
    
            // Check if there is data for the specified language
            if (listAll.length > 0) {
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

    getHome: async (req, res, next) => {
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

    /**
     * Update
     */
    updateHome: async (req, res, next) => {
        try {
            // Check if the provided ID is valid
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid ID format" });
            }
    
            // Fetch the existing document
            const home = await Home.findById(req.params.id);
            if (!home) {
                return res.status(404).json({ message: "Home Section Not Found" });
            }
            console.log('Uploaded File:', req.file);
            console.log('Request Body:', req.body);
    
            // Update fields if provided in request body
            if (req.body.languageCode) {
                home.languageCode = req.body.languageCode;
            }
    
            // Update 'homeContact' fields if provided in request body
            if (req.body.homeContact) {
                const { title, animatedText, company, mobile, email, address, btn } = req.body.homeContact;
    
                if (title) home.homeContact.title = title;
                if (animatedText) home.homeContact.animatedText = animatedText;
                if (company) home.homeContact.company = company;
                if (mobile) home.homeContact.mobile = mobile;
                if (email) home.homeContact.email = email;
                if (address) home.homeContact.address = address;
                if (btn) home.homeContact.btn = btn;
            }
    
            // Update 'homeCarouselSection' fields if provided in request body
            if (req.body.homeCarouselSection && Array.isArray(req.body.homeCarouselSection)) {
                req.body.homeCarouselSection.forEach((carouselItem) => {
                    const existingItem = home.homeCarouselSection.find(item => item._id.toString() === carouselItem._id);
            
                    if (existingItem) {
                        console.log('Found Carousel Item:', existingItem); // Log the found carousel item
            
                        if (carouselItem.carouselTitle) {
                            existingItem.carouselTitle = carouselItem.carouselTitle;
                            console.log('Updated Carousel Title:', existingItem.carouselTitle); // Log updated title
                        }
    
                        // Only update image if a new file is uploaded
                        if (req.file) {
                            existingItem.carouselImg = `/upload/${req.file.filename}`; // Set the image path
                            console.log('Image updated:', existingItem.carouselImg); // Log updated image
                        } else {
                            console.log('No image file uploaded');
                        }
                    } else {
                        console.log('Carousel item not found with ID:', carouselItem._id); // Log if no match
                    }
                });
            }
            
            // Save the updated document
            const updatedHome = await home.save();
    
            // Return the updated document
            res.json({ message: "Home Section Updated", data: updatedHome });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
     

    /**
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
