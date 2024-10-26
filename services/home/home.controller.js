const Services = require("./home.services");
const mongoose = require('mongoose');
const commonResponse = require('../../helper/commonResponse');
const Home = require('./home.model');
module.exports = {
 
     createHome : async (req, res) => {
        try {
            // Check if yearImg and img were uploaded
            const yearImgFile = req.files['homeAboutSection[yearImg]'] ? req.files['homeAboutSection[yearImg]'][0].filename : null;
            const imgFile = req.files['homeAboutSection[img]'] ? req.files['homeAboutSection[img]'][0].filename : null;
    
            // Check if carousel images were uploaded
            const carouselFiles = req.files['homeCarouselSection[carouselImg]'];
            if (!carouselFiles || carouselFiles.length === 0) {
                return commonResponse.error(res, "carouselImg is required", 400, "CAROUSEL_IMG_REQUIRED");
            }
    
            const carouselTitles = req.body.carouselTitles || []; // Extract titles if provided
    
            // Destructure body data
            const {
                languageCode, title, description, buttonTitle,
                aboutTitle, aboutDescription, animatedText, yearOfWork, 
                companyYear, companyYearDesc, companyProject, companyProjectDesc,
                companyCustomer, companyCustomerDesc,  // Added customer destructuring
                contactTitle, contactAnimatedText, contactCompany, contactMobile, 
                contactEmail, contactAddress, contactBtn
            } = req.body;
    
            // Ensure the languageCode is either 'en' or 'vn'
            if (languageCode !== 'en' && languageCode !== 'vn') {
                return commonResponse.error(res, "Invalid language code", 400, "INVALID_LANGUAGE_CODE");
            }
    
            // Check if the home data already exists based on languageCode
            const existingHome = await Services.findByLanguageCode(languageCode);
    
            // Create or Update logic
            if (existingHome) {
                // Update header section
                existingHome.headerSection = {
                    title: title || existingHome.headerSection.title,
                    description: description || existingHome.headerSection.description,
                    buttonTitle: buttonTitle || existingHome.headerSection.buttonTitle
                };
    
                // Update about section
                existingHome.homeAboutSection = {
                    yearImg: yearImgFile ? `/uploads/${yearImgFile}` : existingHome.homeAboutSection.yearImg,  // Update if new image uploaded
                    img: imgFile ? `/uploads/${imgFile}` : existingHome.homeAboutSection.img,                  // Update if new image uploaded
                    [languageCode]: {
                        aboutTitle: aboutTitle || existingHome.homeAboutSection[languageCode].aboutTitle,
                        aboutDescription: aboutDescription || existingHome.homeAboutSection[languageCode].aboutDescription,
                        animatedText: animatedText || existingHome.homeAboutSection[languageCode].animatedText,
                        yearOfWork: yearOfWork || existingHome.homeAboutSection[languageCode].yearOfWork
                    }
                };
    
                // Update carousel section
                const updatedCarouselSection = carouselFiles.map((file, index) => ({
                    title: carouselTitles[index] || existingHome.homeCarouselSection[index]?.title || "",
                    img: `/uploads/${file.filename}`    // Always update with new file paths
                }));
                existingHome.homeCarouselSection = updatedCarouselSection;
    
                // Update company details section
                existingHome.homeCompanyDetailSection[languageCode] = [
                    {
                        year: companyYear || existingHome.homeCompanyDetailSection[languageCode][0].year,
                        yearDesc: companyYearDesc || existingHome.homeCompanyDetailSection[languageCode][0].yearDesc
                    },
                    {
                        project: companyProject || existingHome.homeCompanyDetailSection[languageCode][1].project,
                        projectDesc: companyProjectDesc || existingHome.homeCompanyDetailSection[languageCode][1].projectDesc
                    },
                    {
                        customer: companyCustomer || existingHome.homeCompanyDetailSection[languageCode][2].customer,
                        customerDesc: companyCustomerDesc || existingHome.homeCompanyDetailSection[languageCode][2].customerDesc
                    }
                ];
    
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
    
                return commonResponse.success(res, "Home updated successfully", 200, updatedHome, "UPDATED");
    
            } else {
                // Create new home data
                const languageCode = req.headers.languagecode || 'vn'; // Use 'languagecode' as the key for the header

                // Construct the header section
                const headerSection = {
                    title,
                    description,
                    buttonTitle
                };
    
                // Construct the about section based on languageCode
                const homeAboutSection = {
                    yearImg: `/uploads/${yearImgFile}`,  // Save yearImg path
                    img: `/uploads/${imgFile}`,          // Save img path
                    [languageCode]: {                   // Use languageCode as key for language-specific fields
                        aboutTitle,
                        aboutDescription,
                        animatedText,
                        yearOfWork
                    }
                };
    
                // Process carousel images
                const homeCarouselSection = carouselFiles.map((file, index) => ({
                    title: carouselTitles[index] || "", // Use carousel titles if provided
                    img: `/uploads/${file.filename}`    // Save each carousel image path
                }));
    
                // Company details section based on languageCode
                const homeCompanyDetailSection = {
                    [languageCode]: [
                        {
                            year: companyYear || '',
                            yearDesc: companyYearDesc || ''  // Use destructured variables
                        },
                        {
                            project: companyProject || '',
                            projectDesc: companyProjectDesc || ''  // Use destructured variables
                        },
                        {
                            customer: companyCustomer || '',
                            customerDesc: companyCustomerDesc || ''  // Use destructured variables
                        }
                    ]
                };
    
                // Contact data section based on languageCode
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
                console.log("Home data saved:", savedHome); // Log to verify saving
    
                // Send success response
                return commonResponse.success(res, "Home created successfully", 201, homeData, "SUCCESS");
            }
    
        } catch (error) {
            console.error("Error saving home:", error.message || error);
            return commonResponse.error(res, "Error saving home", 500, "INTERNAL_SERVER_ERROR");
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
