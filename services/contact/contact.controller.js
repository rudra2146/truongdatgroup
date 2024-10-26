const Services = require("./contact.services");
const commonResponse = require('../../helper/commonResponse');

module.exports = {
    createUpdateContact: async (req, res) => {
        try {
            // Destructure files and body from request
            const { bannerTitle, contactMainTitle, contactTitle, headOfficeAddress, representiveOfficeAddress, mobileNumber, email, languageCode } = req.body;
            const contactImageFile = req.files?.contactImageFile ? req.files.contactImageFile[0].filename : null;

            // Optional: Add validation logic here if required (e.g., validateContact function)

            const existingContact = await Services.findByLanguageCode(languageCode);

            const contactData = {
                banner: { title: bannerTitle },
                contactData: {
                    contactMainTitle,
                    title: contactTitle,
                    headOfficeAddress,
                    representiveOfficeAddress,
                    mobileNumber,
                    email,
                    image: contactImageFile ? `/uploads/${contactImageFile}` : existingContact?.contactData.image,
                }
            };

            let responseMessage = "Contact page created successfully";
            let statusCode = 201;

            if (existingContact) {
                await Services.update(existingContact._id, contactData);
                responseMessage = "Contact page updated successfully";
                statusCode = 200;
            } else {
                await Services.add({ languageCode, ...contactData });
            }

            return commonResponse.success(res, responseMessage, statusCode, { languageCode, ...contactData });
        } catch (error) {
            console.error("Error saving contact:", error);
            return commonResponse.error(res, "An error occurred while saving contact data", 500, "ERROR_SAVING_CONTACT");
        }
    },

    listContact: async (req, res) => {
        try {
            const languageCode = req.headers['languagecode']?.toLowerCase() || 'vn';
            const contacts = await Services.list({ deletedAt: null, languageCode });

            if (contacts.length > 0) {
                return commonResponse.success(res, "Contacts Retrieved Successfully", 200, contacts);
            } else {
                return commonResponse.customResponse(res, "No Contacts Found", 404, {}, "No data available");
            }
        } catch (error) {
            console.error("Error fetching contacts:", error.stack);
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    getContactById: async (req, res) => {
        try {
            const contact = await Services.get(req.params.id);
            if (!contact) {
                return commonResponse.error(res, "Contact Not Found", 404);
            }
            return commonResponse.success(res, "Contact Retrieved Successfully", 200, contact);
        } catch (error) {
            console.error("Error fetching contact:", error.stack);
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    deleteContact: async (req, res) => {
        try {
            const contact = await Services.delete(req.params.id);
            if (!contact) {
                return commonResponse.error(res, "Contact Not Found", 404);
            }
            return commonResponse.success(res, "Contact Soft Deleted", 200, contact);
        } catch (error) {
            console.error("Error deleting contact:", error.stack);
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    }
};
