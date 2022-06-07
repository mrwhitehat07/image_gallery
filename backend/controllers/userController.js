const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');
const transporter = require('../config/emailer.config');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs/dist/bcrypt');

// @desc Auth user & get token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    
    const {email, password} = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))){
         res.status(200).json({
             _id: user._id,
             name: user.name,
             email: user.email,
             isAdmin: user.isAdmin,
             token: generateToken(user._id)
         })
    
    }else{
        res.status(401)
        throw new Error('Invalid email or password');
    }  
})

// @desc Register a new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

   if(userExists){
       res.status(400).json({"message" : "User already exists"})
       throw new Error('User already exists');
   }

   const user = await User.create({
       name,
       email,
       password,
   })
   
   if(user){
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
    })
   }else{
        res.status(400)
        throw new Error('Invalid user data')
   }
    
});

const verifyEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const token = generateToken(user._id);
    const url = `http://localhost:8080/api/user/verify/${token}`;
    if (user) {
        await transporter.sendMail({
            to: user.email,
            subject: "Email Verification",
            html: `
                <!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="x-apple-disable-message-reformatting">
                <title></title> 
                <style>
                    table, td, div, h1, p {font-family: Arial, sans-serif;}
                </style>
                </head>
                <body style="margin:0;padding:0;">
                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                    <tr>
                    <td align="center" style="padding:0;">
                        <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                        <tr>
                            <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                            <img src="https://media.istockphoto.com/photos/abstract-digital-network-communication-picture-id888477728?b=1&k=20&m=888477728&s=170667a&w=0&h=ZX15pWkxepMHlk0pg4EMwBiobixDCNmGd-FgDCGf7p8=" alt="" width="300" style="height:auto;display:block;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:36px 30px 42px 30px;">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                <td style="padding:0 0 36px 0;color:#153643;">
                                    <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hello, ${user.name}</h1>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Click on the link below to verify your account.</p>
                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="${url}" style="color:#ee4c50;text-decoration:none;">Click Here</a></p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:30px;background:#ee4c50;">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                <tr>
                                <td style="padding:0;width:50%;" align="left">
                                    <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                    &reg; Trynshop Market 2022
                                    </p>
                                </td>
                                <td style="padding:0;width:50%;" align="right">
                                    <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                    <tr>
                                        <td style="padding:0 0 0 10px;width:38px;">
                                        <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                        </td>
                                        <td style="padding:0 0 0 10px;width:38px;">
                                        <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>
                `,
        });
        res.status(200).json({
            message: "Email sent for verification"
        });
    } else{
        res.status(404)
        throw new Error('User not found')
    }
});

const verifyToken = asyncHandler(async (req, res) => { 
    const token = req.params.token;
    const userData = jwt.verify(token, "b4560283a9d3073bca8a")
    const user = await User.findById(userData.id);
    if (user) {
        await User.updateOne(
            { _id: userData.id },
            {
                $set: {
                    isVerified: true
                }
            }
        );
        res.status(200).json({
            message: "Verified"
        })
    }
    else {
        res.status(404)
        throw new Error('User not found');
    }
});

// @desc Get user profile
// @route GET /api/user/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {   
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified 
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc Update user profile
// @route PUT /api/user/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password || user.password
        }

        const updatedUser = await user.save()
            res.json({
            _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
             isAdmin: updatedUser.isAdmin,
             token:generateToken(updatedUser._id)
        })

    }else{
        res.status(404)
        throw new Error('User not found')
    } 
})

// @desc Update user user
// @route PUT /api/user/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })

    }else{
        res.status(404)
        throw new Error('User not found')
    }
    
    
})

// @desc Get All users
// @route GET /api/user
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find({})
    res.json(users)
    
})
// @desc Get user by ID
// @route GET /api/user/:id
// @access Private/admin
const getUserByID = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
        console.log(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }  
    
})
// @desc Delete User
// @route DELETE /api/user/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message : 'User removed'})
    }else{
        res.status(404)
        throw new Error('User not found')
    }  
})


// @post method
// api/user/forgot-password
const forgotPassword = asyncHandler( async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email })
    if (user) {
        const token = generateToken(user._id)
        const url = `http://localhost:3000/resetpassword/${token}`
        await transporter.sendMail({
            to: email, 
            subject: "Reset password",
            html: `
            <!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title> 
            <style>
                table, td, div, h1, p {font-family: Arial, sans-serif;}
            </style>
            </head>
            <body style="margin:0;padding:0;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                <tr>
                <td align="center" style="padding:0;">
                    <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                    <tr>
                        <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                        <img src="https://media.istockphoto.com/photos/abstract-digital-network-communication-picture-id888477728?b=1&k=20&m=888477728&s=170667a&w=0&h=ZX15pWkxepMHlk0pg4EMwBiobixDCNmGd-FgDCGf7p8=" alt="" width="300" style="height:auto;display:block;" />
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 30px 42px 30px;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                            <tr>
                            <td style="padding:0 0 36px 0;color:#153643;">
                                <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hello, ${user.name}</h1>
                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Click on the link below to reset your password.</p>
                                <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="${url}" style="color:#ee4c50;text-decoration:none;">Click Here</a></p>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;background:#ee4c50;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                            <tr>
                            <td style="padding:0;width:50%;" align="left">
                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                &reg; Trynshop Market 2022
                                </p>
                            </td>
                            <td style="padding:0;width:50%;" align="right">
                                <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                <tr>
                                    <td style="padding:0 0 0 10px;width:38px;">
                                    <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                    </td>
                                    <td style="padding:0 0 0 10px;width:38px;">
                                    <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>
            `
        });
        res.status(200).json({
            message: "Reset link sent to your email address"
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const resetPassword = asyncHandler( async (req, res) => {
    const token = req.params.token;
    const newPassword = req.body.password;
    const cnfPassword = req.body.confPassword;
    const userData = jwt.verify(token, "b4560283a9d3073bca8a");
    const user = await User.findOne({ _id: userData.id });
    const salt = await bcrypt.genSalt(10)
    if (user) {
        if (newPassword === cnfPassword) {
            user.password = await bcrypt.hash(newPassword, salt);
            await User.updateOne({
                _id: user._id
            }, {
                $set: {
                    password: user.password
                }
            });
            res.status(200).json({
                message: "Password changed"
            })
        } else {
            res.status(400).json({
                message: "Passwords donot match"
            })
        }
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

module.exports = { 
    authUser, 
    getUserProfile, 
    registerUser, 
    verifyEmail,
    verifyToken,
    updateUserProfile, 
    getUsers, 
    deleteUser,
    getUserByID, 
    updateUser,
    forgotPassword, 
    resetPassword,
}