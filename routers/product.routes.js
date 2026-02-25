const express = require("express");
const { listProduct } = require("../controllers/product.controller");
const { verifyUser } = require("../controllers/user.controller");
const router = express.Router()

router.post("/listproduct",verifyUser, listProduct)

module.exports = router;