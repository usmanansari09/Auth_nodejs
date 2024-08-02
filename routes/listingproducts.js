// routes/auth.js
const express = require("express");
const router = express.Router();
const Products = require("../models/Products");

router.post("/products", async (req, res) => {
    const { name, price, quantity, size } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ msg: "Product name should not be empty" });
        }
        let names = await Products.findOne({ name });
        if (names) {
            return res.status(400).json({ msg: "Product name already exists" });
        }

        product = new Products({ name, price, quantity, size });
        await product.save();

        res.json({ 'message': `You product is saved with name ${name}`, 'status': true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.get("/products", async (req, res) => {
    try {
        const products = await Products.find();
        return res.status(200).json({
            success: true,
            data: products.reverse()
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
