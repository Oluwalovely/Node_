const mongoose = require('mongoose')


const UserSchema=mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    roles:{type: String, enum:["admin", "user"], default: "user"},  //enum means the value of roles can only be either "admin" or "user"
}, {timestamps: true, strict:"throw"})


const UserModel = mongoose.model('User', UserSchema)   // user => name of the collection in the database, userSchema => schema for the collection

module.exports = UserModel