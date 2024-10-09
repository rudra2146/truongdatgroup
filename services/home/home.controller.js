const Services = require("./home.services");
const commonResponse = require('../../helper/commonResponse');
const mongoose = require('mongoose');
const Home = require('./home.model');



module.exports = {
    /**
     * Create Home (with file upload)
     */
     
    createHome: async (req, res) => {
        // Validation must occur within the context of req and res
        const validationResponse = validateHomeData(req.body);
        if (validationResponse.error) {
            return commonResponse.error(res, validationResponse.message, 400, validationResponse.code);
        }
    
        try {
            // Check if yearImg and img were uploaded
            const yearImgFile = req.files['yearImg'] ? req.files['yearImg'][0].filename : null;
            const imgFile = req.files['img'] ? req.files['img'][0].filename : null;
    
            if (!yearImgFile || !imgFile) {
                return commonResponse.error(res, "yearImg and img are required", 400, "MISSING_IMAGES");
            }
    
            // Check if carousel images were uploaded
            const carouselFiles = req.files['carouselImg'];
            if (!carouselFiles || carouselFiles.length === 0) {
                return commonResponse.error(res, "carouselImg is required", 400, "CAROUSEL_IMG_REQUIRED");
            }
            const carouselTitles = req.body.carouselTitles; // Extract titles
    
            // Destructure body data
            const {
                languageCode, title, description, buttonTitle,
                aboutTitle, aboutDescription, animatedText, yearOfWork,
                contactTitle, contactAnimatedText, contactCompany, contactMobile,
                contactEmail, contactAddress, contactBtn
            } = req.body;
    
            // Check if an entry with the same languageCode already exists using getByLanguageCode
            const existingEntry = await Services.getByLanguageCode(languageCode);
            if (existingEntry) {
                return commonResponse.error(res, "LanguageCode already exists", 400, "LANGUAGE_CODE_EXISTS");
            }
    
            // Construct the header section
            const headerSection = {
                title,
                description,
                buttonTitle
            };
    
            // Construct the about section
            const homeAboutSection = {
                yearImg: `/uploads/${yearImgFile}`,
                img: `/uploads/${imgFile}`,
                [languageCode]: {
                    aboutTitle,
                    aboutDescription,
                    animatedText,
                    yearOfWork
                }
            };
    
            // Process carousel images
            const homeCarouselSection = carouselFiles.map((file, index) => ({
                title: carouselTitles[index] || "Default Title", // Provide a default if no title is found
                img: `/uploads/${file.filename}`
            }));
    
            // Company details
            const homeCompanyDetailSection = {
                [languageCode]: []  // Only add the specific language's data
            };
    
            if (languageCode === 'en') {
                homeCompanyDetailSection.en.push({
                    year: req.body.companyYear || '',
                    yearDesc: req.body.companyYearDesc || '',
                    project: req.body.companyProject || '',
                    projectDesc: req.body.companyProjectDesc || '',
                    customer: req.body.companyCustomer || '',
                    customerDesc: req.body.companyCustomerDesc || ''
                });
            } else if (languageCode === 'vn') {
                homeCompanyDetailSection.vn.push({
                    year: req.body.companyYearVN || '',
                    yearDesc: req.body.companyYearDescVN || '',
                    project: req.body.companyProjectVN || '',
                    projectDesc: req.body.companyProjectDescVN || '',
                    customer: req.body.companyCustomerVN || '',
                    customerDesc: req.body.companyCustomerDescVN || ''
                });
            }
    
            // Contact data
            const homeContactData = {
                [languageCode]: {
                    title: contactTitle || '',
                    animatedText: contactAnimatedText || '',
                    company: contactCompany || '',
                    mobile: contactMobile || '',
                    email: contactEmail || '',
                    address: contactAddress || '',
                    btn: contactBtn || ''
                }
            };
    
            // Construct the final home data object
            const homeData = {
                languageCode,
                headerSection,
                homeAboutSection,
                homeCarouselSection,
                homeCompanyDetailSection,
                homeContactData
            };
    
            // Save home data to the database
            const savedHome = await Services.add(homeData);
    
            // Construct the response
            const responseData = {
                _id: savedHome._id,
                languageCode,
                headerSection,
                homeAboutSection,
                homeCarouselSection,
                homeCompanyDetailSection,
                homeContactData
            };
    
            // Send success response with the correct output structure
            return res.status(201).json({
                error: false,
                message: "SUCCESS",
                statusCode: 201,
                messageCode: "Home created successfully",
                data: responseData
            });
    
        } catch (error) {
            console.error("Error saving home:", error.message || error);
            return commonResponse.error(res, "Error saving home", 500, "INTERNAL_SERVER_ERROR");
        }
    },
    
    

    /**
     * List Homes
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
     * Get Home by Language Code
     */
    getHome: async (req, res) => {
        try {
            const languageCode = req.headers['languagecode'] || 'vn'; // Default to 'vn' if no languageCode is provided
    
            // Retrieve the home section by languageCode (single object, not an array)
            const homeByLanguage = await Services.getByLanguageCode(languageCode);
    
            if (!homeByLanguage) {
                return commonResponse.error(res, `Home Section Not Found for language code: ${languageCode}`, 404);
            }
    
            // Extract `homeCarouselSection` and `homeContact` for clarity (if you want to return them specifically)
            const { homeCarouselSection, homeContact } = homeByLanguage;
    
            // Respond with the full home object, including both fields
            return commonResponse.success(
                res,
                `Home Retrieved Successfully for language code: ${languageCode}`,
                200,
                { homeCarouselSection, homeContact }, // Send both fields explicitly
                "Success"
            );
        } catch (error) {
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    /**
     * Update Home
     */
    /**
 * Update Home
 */
    updateHome: async (req, res) => {
        try {
            const { languageCode } = req.params;
            const updateData = req.body;
    
            console.log(req.params);
            console.log(req.body);
    
            // Handling about section images
            const yearImg = req.files['yearImg'] ? req.files['yearImg'][0].path : null;
            const img = req.files['img'] ? req.files['img'][0].path : null;
            const carouselImgs = req.files['homeCarouselSection'] ? req.files['homeCarouselSection'].map(file => file.path) : [];

            console.log(req.files);

            // Ensure homeHeader is present and map it to headerSection
            if (updateData.homeHeader) {
                updateData.headerSection = {
                    title: updateData.homeHeader.title || '',
                    description: updateData.homeHeader.description || '',
                    buttonTitle: updateData.homeHeader.buttonTitle || ''
                };
            } else {
                return res.status(400).json({
                    error: true,
                    message: "homeHeader is missing from the request",
                    statusCode: 400
                });
            }
    
            // Update about section
            updateData.homeAboutSection = {
                ...updateData.homeAboutSection,
                yearImg,
                img
            };
    

    
            // Handling homeCompanyDetailSection
            if (updateData.homeCompanyDetailSection) {
                updateData.homeCompanyDetailSection = {
                    en: updateData.homeCompanyDetailSection.en || [],
                    vn: updateData.homeCompanyDetailSection.vn || []
                };
            } else {
                return res.status(400).json({
                    error: true,
                    message: "homeCompanyDetailSection is missing from the request",
                    statusCode: 400
                });
            }
    
            // Handling homeContactData
            if (updateData.homeContactData) {
                updateData.homeContactData = {
                    en: {
                        contactTitle: updateData.homeContactData.en?.title || '',
                        animatedText: updateData.homeContactData.en?.animatedText || '',
                        company: updateData.homeContactData.en?.company || '',
                        mobile: updateData.homeContactData.en?.mobile || '',
                        email: updateData.homeContactData.en?.email || '',
                        address: updateData.homeContactData.en?.address || '',
                        btn: updateData.homeContactData.en?.btn || ''
                    },
                    vn: {
                        contactTitle: updateData.homeContactData.vn?.title || '',
                        animatedText: updateData.homeContactData.vn?.animatedText || '',
                        company: updateData.homeContactData.vn?.company || '',
                        mobile: updateData.homeContactData.vn?.mobile || '',
                        email: updateData.homeContactData.vn?.email || '',
                        address: updateData.homeContactData.vn?.address || '',
                        btn: updateData.homeContactData.vn?.btn || ''
                    }
                };
            } else {
                return res.status(400).json({
                    error: true,
                    message: "homeContactData is missing from the request",
                    statusCode: 400
                });
            }
    
            // Check if the document exists for the given languageCode
            let updatedHome = await Services.getByLanguageCode(languageCode);
    
            if (updatedHome) {
                // Update existing document fields based on request
                updatedHome.headerSection = updateData.headerSection; // Update headerSection
                updatedHome.homeAboutSection = updateData.homeAboutSection; // Update about section
                updatedHome.homeCarouselSection = updateData.homeCarouselSection; // Update carousel section
                updatedHome.homeCompanyDetailSection = updateData.homeCompanyDetailSection; // Update company detail section
                updatedHome.homeContactData = updateData.homeContactData; // Update contact data
    
                await updatedHome.save(); // Save the updated document
            } else {
                // Create a new document if it doesn't exist
                updatedHome = new Home({
                    languageCode, // New languageCode
                    headerSection: updateData.headerSection, // Use updated headerSection
                    homeAboutSection: updateData.homeAboutSection,
                    homeCarouselSection: updateData.homeCarouselSection,
                    homeCompanyDetailSection: updateData.homeCompanyDetailSection,
                    homeContactData: updateData.homeContactData // Add homeContactData
                });
                await updatedHome.save(); // Save the new document
            }
    
            return res.status(200).json({
                error: false,
                message: "Home updated successfully",
                statusCode: 200,
                data: {
                    ...updatedHome._doc, // Send all fields from the updatedHome document
                    homeHeader: updatedHome.headerSection, // Include homeHeader in the response
                    homeCompanyDetailSection: updatedHome.homeCompanyDetailSection,
                    homeContactData: updatedHome.homeContactData // Include homeContactData in the response
                }
            });
        } catch (error) {
            console.error("Error in updateHome:", error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
                statusCode: 500,
                messageCode: error.message
            });
        }
    },
       
         


    /**
     * Delete Home (Soft Delete)
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
