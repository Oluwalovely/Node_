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

module.exports = {
    createUser,
    editUser
}