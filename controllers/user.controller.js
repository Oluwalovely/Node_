const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



const createUser = async (req, res) => {
    const { lastName, firstName, email, password } = req.body;

    try {
        const saltround = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, saltround)


        const user = await UserModel.create({firstName, lastName, email, password:hashedPassword});

        const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"5h"})
        res.status(201).send({
            message: "User created successfully",
            data: {
                lastName,
                email,
                firstName,
                roles:user.roles
            },
            token
        })
    } catch (error) {
        console.log(error);

        if(error.code == 11000){
            res.status(400).send({
            message: "User already registered",
            })
        }else{
            res.status(400).send({
                message: "Error creating user",
            })
        }
    }
}

const login=async (req, res)=>{
    const {email, password}=req.body
    try {
        const isUser = await UserModel.findOne({email})
        if (!isUser) {
            res.status(404).send({
                message:"Invalid credentials"
            })

            return
        } 
    const isMatch = await bcrypt.compare(password, isUser.password)
    if(!isMatch){
        res.status(404).send({
            message: "Invalid credentials"
        })

        return
    }

    const token = await jwt.sign({id:isUser._id}, process.env.JWT_SECRET, {expiresIn:"5h"})
    res.status(200).send({
        message:"User logged in successfully",
        data:{
            email:isUser.email,
            roles:isUser.roles,
            firstName:isUser.firstName,
            lastName:isUser.lastName
        },
        token
    })
    } catch (error) {
        console.log(error);

        res.status(404).send({
            message:"Invalid credentials"
        })
        
    }
}

const editUser = async (req, res) => {
    const { firstName, lastName } = req.body
    const { id } = req.params;
    try {
        let allowedUpdate = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName })
        }
        const newUser = await UserModel.findByIdAndUpdate(id, allowedUpdate)
        res.status(200).send({
            message: "User updated successfully",
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message: "User update failed"
        })

    }
}

const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        let deletedUser = await UserModel.findByIdAndDelete(id);
        res.status(204).send({
            message: "User deleted successfully",
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message: "User not deleted successfully"
        })
        
    }
}

const getUser = async (req, res)=>{
    const {id} = req.params;
    try {
        let user = await UserModel.findById(id).select("-password -roles");
        res.status(200).send({
            message: "User retrieved successfully",
            data: user
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message: "User not retrieved successfully"
        })
        
    }
}

const getAllUsers = async (req, res) => {
    try {
        let allUsers = await UserModel.find().select("-password -roles");
        res.status(200).send({
            message: "All users retrieved successfully",
            data: allUsers
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message: "Users not retrieved successfully"
        })
    }
}

module.exports = {
    createUser,
    editUser,
    deleteUser,
    getUser,
    getAllUsers,
    login
}