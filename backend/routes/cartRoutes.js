const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

router.post('/add-to-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productIdStr = productId.toString();
        const cartItem = user.cart.find((item) => item.productId.toString() === productIdStr);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ productId: productIdStr, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Get user's cart
router.get('/:userName', async (req, res) => {
    const { userName } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userName)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userName).populate({
            path: 'cart.productId',
            select: 'name price',
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Updating product to cart
router.post('/update', async (req, res) => {
    const { userId, cart } = req.body;

    if (!Array.isArray(cart) || cart.some(item => !item.productId || item.quantity <= 0)) {
        return res.status(400).json({ message: "Invalid cart items" });
    }    

    // Validate ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = cart || [];
        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        console.error('Error during cart update:', error);
        res.status(500).json({ message: 'Server error', error: error.stack });
    }
});

//updating final cart
router.put('/update-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productIdStr = productId.toString();
        if (quantity === 0) {
            user.cart = user.cart.filter((item) => item.productId.toString() !== productIdStr); // Remove item
        } else if (quantity > 0) {
            const existingItem = user.cart.find(item => item.productId.toString() === productIdStr);
            if (existingItem) {
                existingItem.quantity = quantity; // Update the quantity of the existing item
            } else {
                user.cart.push({ productId: productIdStr, quantity }); // Add new item if it doesn't exist
            }
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await user.save();
        res.status(200).json({ message: 'Cart updated', cart: user.cart });
    } catch (error) {
        console.error("Error in /update-cart route:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the product from the cart
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save(); // Save changes to the database

        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
