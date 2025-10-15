import {User } from "../models/user.models.js"
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        
        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken();

        user.refreshToken = RefreshToken

        await user.save({validateBeforeSave : false})

        return {AccessToken, RefreshToken};
    } catch (error) {
        throw new ApiError(500, "Internal Server Error in generating Access or RefreshToken or both.");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {email, username, password} = req.body;
    const existingUser = await User.findOne({
        $or : [{email}, {username}]
    })

    if(existingUser){
        throw new ApiError(409, "user with the same username or email  already exists");
    }

    const user = await User.create({
        email,
        password,
        username
    })

    await user.save({validateBeforeSave : false})

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Internal Server Error : Creating user")
    }

    return res.status(201)
        .json(
            new ApiResponse(
                200, 
                {
                    user : createdUser
                },
                "User registered successfully"
            )
        )
})

const login = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body;

    if(!email){
        throw new ApiError(400, "Email or username is required");
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new ApiError(404, "user not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials");
    }

    // console.log(user._id);
    

    const {AccessToken, RefreshToken} = await generateAccessAndRefreshToken(user._id)
    

    const loggedInUser = await User.findById(user._id).select(
        "-refreshToken"
    )
    

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };


    return res.status(200)
            .cookie("access_token", AccessToken,option)
            .cookie("refresh_token", RefreshToken, option)
            .json(
                new ApiResponse(
                    200,
                {
                    user : loggedInUser,
                    AccessToken,
                    RefreshToken
                },
                "user logged in successfully"
                )
            )
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : ""
            }
        },
        {
            new:true
        }
    )


    return res
        .status(200)
        .clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "lax" })
        .clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "lax" })
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    )
})


const refreshAccessToken =  asyncHandler(async (req , res, next) => {
    const incomingRefreshToken = req.cookies.refresh_token || req.body.AccessToken

    if(!incomingRefreshToken){
        throw new ApiError(400, "Refresh Token is missing")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "User not found")
        }

        if(incomingRefreshToken != user.refreshToken){
            throw new ApiError(401, "Refresh Token expired")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };


        const {AccessToken, RefreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = newRefreshToken
        await user.save()

        return res.status(200)
            .cookie("access_token", AccessToken, options)
            .cookie("refresh_token", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        AccessToken,
                        RefreshToken : newRefreshToken
                    },
                    "Tokens refreshed successfully"
                )
            )
    } catch (error) {
        
    }
})

export {
    generateAccessAndRefreshToken,
    registerUser,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken
};