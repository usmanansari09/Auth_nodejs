// routes/auth.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const Products = require("../models/Products");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/products", upload.single('image'), async (req, res) => {
    const { name, price, quantity, size } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
            product = new Products({ name, price, quantity, size, image });
            await product.save();
            res.json({ 'message': `You product is saved with name ${name}`, 'status': true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.get("/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        let products;
        let totalProducts = await Products.countDocuments();

        if (!page || !limit) {
            products = await Products.find();
        } else {
            const startIndex = (page - 1) * limit;
            products = await Products.find().skip(startIndex).limit(limit);
        }
        return res.status(200).json({
            success: true,
            page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            data: products.reverse(),
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
//show by id

router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findOne({ _id: id });
        if (product) {
            return res.status(200).json({
                success: true,
                data: product
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "product not found",
            })
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
//update by id

router.put("/products/:id", async (req, res) => {
    try {
        const { name, price, quantity, size } = req.body;
        const { id } = req.params;
        const product = await Products.findOne({ _id: id });
        if (product) {
            product.updateOne(
                {
                    $set: {
                        name: name,
                        price: price,
                        quantity: quantity,
                        size: size
                    }
                },
                {}, { new: true }
            )

            return res.status(201).json({
                success: true,
                message: "product updated sucessfully",
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "product not found",
            })
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
//delete by id

router.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.deleteOne({ _id: id });
        if (product) {
            return res.status(200).json({
                success: true,
                message: "product deleted sucessfully",
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "product not found",
            })
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
module.exports = router;
