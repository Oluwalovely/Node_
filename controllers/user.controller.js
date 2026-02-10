const UserModel = require("../models/user.model");



const createUser = async (req, res) => {
    const { lastName, firstName, email, password } = req.body;

    try {
        const user = await UserModel.create(req.body)
        res.status(201).send({
            message: "User created successfully",
            data: {
                lastName,
                email,
                firstName
            }
        })
    } catch (err) {
        console.log(err);


        res.status(400).send({
            message: "Error creating user",
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
        res.status(200).send({
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
        let user = await UserModel.findById(id);
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
        let allUsers = await UserModel.find();
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
    getAllUsers
}