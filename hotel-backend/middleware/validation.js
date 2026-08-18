const { body, validationResult } = require("express-validator");

const hotelValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    body("longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel data",
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    hotelValidation
};
