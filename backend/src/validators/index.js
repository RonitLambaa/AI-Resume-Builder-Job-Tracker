import {body} from "express-validator"

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is requied")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLowercase()
            .withMessage("username must be in lowercase")
            .isLength({min:5})
            .withMessage("username must be atleast 5 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required")
            .isLength({min:6})
            .withMessage("password must be atleast 6 characters long"),

        body("fullname")
        .optional()
        .trim()
            
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

export {userRegisterValidator, userLoginValidator}