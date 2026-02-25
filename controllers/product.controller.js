const ProductModel = require("../models/product.model");
const cloudinary = require("cloudinary").v2

cloudinary.config({
    api_key:process.env.CLOUD_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET
})
const listProduct = async (req, res) =>{
    const{productName, productprice, productQuantity, createdBy, productImage}=req.body;

    try {
        let image = await cloudinary.uploader.upload(productImage, (error)=>{
            if(error){
                res.status(500).send({
                    message:"Error uploading image",
                })
                return
            }

             image = {
                public_id: result.public_id,
                secure_url: result.secure_url
            }

            return image
        })

        const product = await ProductModel.create({
            productName,
            productPrice,
            productQuantity,
            productImage:image,
            createdBy:req.user._id
        })
        res.status(201).send({
            success:true,
            message:"Product added successfully",
            data:product
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message:"Error adding product",
        })
        
    }
}


module.exports = {
    listProduct
}